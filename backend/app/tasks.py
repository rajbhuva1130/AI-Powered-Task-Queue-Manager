from celery import Celery
import time

celery = Celery(__name__)

@celery.task(bind=True)
def process_text_task(self, text):
    """Simulated AI text processing"""
    self.update_state(state="PROCESSING", meta={"progress": 10})
    time.sleep(2)
    summary = f"AI Summary: {text[:80]}..."
    time.sleep(2)
    return summary

@celery.task(bind=True)
def long_running_task(self, duration):
    """A long-running task that updates its progress."""
    for i in range(duration):
        time.sleep(1)
        self.update_state(state="PROGRESS", meta={"current": i + 1, "total": duration})
    return {"current": duration, "total": duration, "status": "Task completed!"}

@celery.task(bind=True)
def failing_task(self):
    """A task that simulates failure."""
    time.sleep(2)
    raise Exception("Simulated task failure")

@celery.task(bind=True)
def quick_task(self):
    """A quick task that completes immediately."""
    return "Quick task completed"