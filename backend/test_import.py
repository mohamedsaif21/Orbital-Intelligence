#!/usr/bin/env python
import sys
import traceback

print("Python path:", sys.path)
print("Working directory:", sys.path[0] if sys.path else "N/A")

try:
    print("\n--- Attempting to import app.main ---")
    from app import main
    print("✓ Successfully imported app.main")
except Exception as e:
    print(f"✗ Import failed with error:")
    traceback.print_exc()
