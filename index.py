
import random

# Each boy has a possible loss and gain percentage
boys = {
    "1": ("Alex", -5, 10),
    "2": ("Jamie", -15, 25),
    "3": ("Taylor", -30, 50)
}

# Relationship news for each outcome

good_news = {
    "1": [
        "Alex plans a surprise date!",
        "Alex buys you flowers!",
        "Alex bakes you cookies!",
        "Alex wants to go on holiday with you!",
        "Alex cleans the house!"
    ],

    "2": [
        "Jamie sends you a flirty message!",
        "Jamie asks you on a romantic date!",
        "Jamie falls asleep on ft with you!",
        "Jamie serenades you with his guitar!",
        "Jamie blocks his ex!"
    ],

    "3": [
        "Taylor texts: 'I miss you...'",
        "Taylor wants to get back together!",
        "Taylor sends £1000!",
        "Taylor uses your birthday to slide back into your dms!",
        "Taylor slid up on your instagram story!"
    ]
}

bad_news = {
    "1": [
        "Alex forgets your date!",
        "Alex catches you texting Jamie!",
        "Alex sees a suspicious Instagram comment!",
        "Alex doesnt watch the 84 insta reels you sent him!",
        "Alex doesnt text you good morning!"
    ],

    "2": [
        "Jamie leaves you on read!",
        "Jamie goes on a date with his coworker!",
        "Jamie responds to your heartfelt paragraph message with a thumbs up!",
        "Jamie spends your whole date on his phone!",
        "Jamie insulted your best friend!"
    ],

    "3": [
        "Taylor gets back with his ex!",
        "Taylor blocks you on Instagram!",
        "Taylor goes on a boys trip to Las Vegas!",
        "Taylor asks you to come over at 2am!",
        "Taylor calls you his exes name!"
    ]
}


# Extra scandal events
# Each event has a description and an extra percentage change

scandals = {
    "1": [
        ("Alex finds your secret dating profile!", -20),
        ("Alex proposes to you!", 30),
        ("Alex finds Jamie's hoodie in your room!", -25)
    ],

    "2": [
        ("Jamie accidentally posts you on his story!", -15),
        ("Jamie confesses his love for you!", 35),
        ("Jamie finds out about Taylor!", -30)
    ],

    "3": [
        ("Taylor turns up at your house uninvited!", -20),
        ("Taylor buys you a car!", 50),
        ("Taylor exposes your group chat!", -40)
    ]
}



time = 100
max_rounds = 3


def invest(choice, amount):
    name, loss, gain = boys[choice]

    # Randomly choose a percentage change
    percentage = random.choice([loss, gain])

    # Calculate profit or loss
    profit = round(amount * percentage / 100)

    # Choose the matching news story
    if percentage > 0:
        news = random.choice(good_news[choice])
    else:
        news = random.choice(bad_news[choice])

    return name, percentage, profit, news


def random_scandal(investments):

    # Randomly select one boy
    choice = random.choice(list(boys.keys()))

    # Get his name
    name = boys[choice][0]

    # Randomly select one of his scandals
    event, percentage = random.choice(scandals[choice])

    # Find how much you invested in him
    amount = investments[choice]

    # Calculate extra profit or loss
    profit = round(amount * percentage / 100)

    return name, event, percentage, profit

print("================================")
print("   LOVE, LIES & LIABILITIES")
print("================================")
print("Welcome to the dating stock market!")
print("You start with 100 minutes.")

# Main game loop
for round_number in range(1, max_rounds + 1):

    print(f"\n========== ROUND {round_number} ==========")
    print(f"Your balance: {time} minutes")

    investments = {}
    remaining = time

    # Let the player invest in all three boys
    for key, (name, loss, gain) in boys.items():

        print(f"\n{name}")
        print(f"Possible returns: {loss}% or +{gain}%")
        print(f"Available minutes: {remaining}")

        while True:
            try:
                amount = int(input(
                    f"How many minutes on {name}? "
                ))

                if 0 <= amount <= remaining:
                    break

                print(f"Enter between 0 and {remaining}.")

            except ValueError:
                print("Please enter a whole number.")

        investments[key] = amount
        remaining -= amount

    # Display the player's portfolio
    print("\n------ YOUR PORTFOLIO ------")

    for key, amount in investments.items():
        name = boys[key][0]
        print(f"{name}: {amount} minutes")

    print(f"Cash remaining: {remaining} minutes")

    # Calculate the results
    print("\n------ BREAKING RELATIONSHIP NEWS ------")

    total_profit = 0

    
    # Normal market movements
    print("\n------ RELATIONSHIP NEWS ------")

    total_profit = 0

    for key, amount in investments.items():

        name, percentage, profit, news = invest(key, amount)

        print(f"\n{name}: {news}")
        print(f"Market movement: {percentage:+}%")
        print(f"Profit/loss: {profit:+} minutes")

        total_profit += profit

    # One additional random scandal
    print("\n------ BREAKING SCANDAL ------")

    name, event, percentage, profit = random_scandal(investments)

    print(f"\n{event}")
    print(f"{name}'s value changed by an extra {percentage:+}%!")
    print(f"Scandal profit/loss: {profit:+} minutes")

    total_profit += profit


    # Update the player's balance
    time += total_profit

    print("\n------ ROUND RESULTS ------")
    print(f"Total profit/loss: {total_profit:+} minutes")
    print(f"New balance: {time} minutes")

    if time == 0:
        print("\nYou have run out of minutes!")
        break


# Final results
print("\n================================")
print("             GAME OVER")
print("================================")

print(f"Starting balance: 100 minutes")
print(f"Final balance: {time} minutes")

overall_profit = time - 100

if overall_profit > 0:
    print(f"You made {overall_profit} minutes!")
    print("You're the queen of the dating market!")

elif overall_profit < 0:
    print(f"You lost {abs(overall_profit)} minutes!")
    print("The dating market has humbled you.")

else:
    print("You broke even!")
    print("No heartbreak, no profit.")



