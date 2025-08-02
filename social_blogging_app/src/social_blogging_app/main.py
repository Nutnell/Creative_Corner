#!/usr/bin/env python
import sys
import warnings
import os

# Manually add the parent directory of this script to the Python pathcd..
# This allows the 'social_blogging_ai' module to be found
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.abspath(os.path.join(current_dir, '..', '..')))

from social_blogging_app.crew import SocialBloggingAi
from datetime import datetime # <-- Add this line

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def run():
    """
    Run the crew.
    """
    print("## Social Blogging Crew ##")
    print("-------------------------------")
    topic = input("Enter a topic for the blog post: ")
    current_year = str(datetime.now().year)

    inputs = {
        'topic': topic,
        'current_year': current_year
    }

    try:
        SocialBloggingAi().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")