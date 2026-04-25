subscribers = {}

def subscribe(event_type, callback):
    """
    Register a function to respond to a specific system event.
    """
    if event_type not in subscribers:
        subscribers[event_type] = []
    subscribers[event_type].append(callback)
    print(f"🔗 Subscribed to event: {event_type}")

def emit(event_type, data):
    """
    Broadcast an event to all registered subscribers.
    """
    if event_type in subscribers:
        for callback in subscribers[event_type]:
            try:
                callback(data)
            except Exception as e:
                print(f"⚠️ Event callback error: {e}")
