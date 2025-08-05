# src/social_blogging_ai/crew.py

from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from typing import List
from crewai.agents.agent_builder.base_agent import BaseAgent
import sys
import os

# path for local imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from utils.llm_factory import get_llm_model_name
llm_model_name = get_llm_model_name()

from .tools.custom_tool import (
    get_current_trends,
    generate_draft,
    edit_draft,
    summarize_post
)

@CrewBase
class SocialBloggingAi():
    """SocialBloggingAi crew"""

    agents: List[BaseAgent]
    tasks: List[Task]

    @agent
    def trend_hunter(self) -> Agent:
        return Agent(
            config=self.agents_config['trend_hunter'], 
            tools=[get_current_trends],
            llm=llm_model_name,
            verbose=True
        )
    
    @agent
    def content_writer(self) -> Agent:
        return Agent(
            config=self.agents_config['content_writer'],
            tools=[generate_draft],
            llm=llm_model_name,
            verbose=True
        )

    @agent
    def editor(self) -> Agent:
        return Agent(
            config=self.agents_config['editor'],
            tools=[edit_draft],
            llm=llm_model_name,
            verbose=True
        )

    @agent
    def summarizer(self) -> Agent:
        return Agent(
            config=self.agents_config['summarizer'],
            tools=[summarize_post],
            llm=llm_model_name,
            verbose=True
        )

    @task
    def trend_research(self) -> Task:
        return Task(
            config=self.tasks_config['trend_research'],
            agent=self.trend_hunter(),
            output_file='trend_report.txt'
        )

    @task
    def content_generation(self) -> Task:
        return Task(
            config=self.tasks_config['content_generation'],
            agent=self.content_writer(),
            context=[self.trend_research()],
            output_file='draft_blog_post.txt'
        )

    @task
    def blog_editing(self) -> Task:
        return Task(
            config=self.tasks_config['blog_editing'],
            agent=self.editor(),
            context=[self.content_generation()],
            output_file='edited_blog_post.txt'
        )

    @task
    def content_summarization(self) -> Task:
        return Task(
            config=self.tasks_config['content_summarization'],
            agent=self.summarizer(),
            context=[self.blog_editing()],
            output_file='final_blog_summary.txt'
        )

    @crew
    def crew(self) -> Crew:
        """Creates the SocialBloggingAi crew from the specified agents and tasks"""
        self.agents = [
            self.trend_hunter(), 
            self.content_writer(), 
            self.editor(), 
            self.summarizer()
        ]
        self.tasks = [
            self.trend_research(),
            self.content_generation(),
            self.blog_editing(),
            self.content_summarization()
        ]

        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )
