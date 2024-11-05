x=None

def set():
    global x
    if x:
        print(f"x already set to {x}\n")
    x = 3
    print(f"inside set x={x}\n")

print(f"before call x = {x}\n")
set()
print(f"after call x = {x}\n")
set()
