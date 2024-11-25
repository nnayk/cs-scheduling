
time_slots = [
            f'"{hour}:{minute:02d} {"AM" if hour < 12 else "PM"}"' 
            for hour in range(9, 12)  # 9 AM to 11 AM
            for minute in (0, 30)
        ] + [
            f'"{hour - 12 if hour > 12 else hour}:{minute:02d} {"AM" if hour < 12 else "PM"}"'
            for hour in range(12, 17)  # 12 PM to 5 PM
            for minute in (0, 30)
        ]



time_slots_cols = [
            f'"{hour}:{minute:02d} {"AM" if hour < 12 else "PM"}" VARCHAR(255)' 
            for hour in range(9, 12)  # 9 AM to 11 AM
            for minute in (0, 30)
        ] + [
            f'"{hour - 12 if hour > 12 else hour}:{minute:02d} {"AM" if hour < 12 else "PM"}" VARCHAR(255)'
            for hour in range(12, 17)  # 12 PM to 5 PM
            for minute in (0, 30)
        ]

