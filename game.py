
import pygame
import random

pygame.init()

# Create the game window
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Little Market Town")

# Colours
CREAM = (255, 247, 230)
PINK = (255, 195, 210)
GREEN = (175, 225, 180)
PURPLE = (205, 190, 240)
DARK = (70, 60, 75)

# Fonts
font = pygame.font.SysFont(None, 36)
big_font = pygame.font.SysFont(None, 52)

# Your original game data
options = {
    "1": ("Steady Fund", -5, 10),
    "2": ("Tech Startup", -15, 25),
    "3": ("Wild Venture", -30, 50)
}

coins = 50
round_number = 1
message = "Choose your investment!"

# Create three clickable rectangles
buttons = [
    pygame.Rect(100, 220, 600, 80),
    pygame.Rect(100, 320, 600, 80),
    pygame.Rect(100, 420, 600, 80)
]

running = True

while running:

    # Check for player interactions
    for event in pygame.event.get():

        if event.type == pygame.QUIT:
            running = False

        if event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1 and round_number <= 3:

                for i, button in enumerate(buttons):

                    if button.collidepoint(event.pos):
                        choice = str(i + 1)

                        name, loss, gain = options[choice]
                        change = random.choice([loss, gain])

                        coins = max(0, coins + change)

                        if change > 0:
                            message = f"{name}: +{change} coins!"
                        else:
                            message = f"{name}: {change} coins!"

                        round_number += 1
                        break

    # Draw background
    screen.fill(CREAM)

    # Draw title
    title = big_font.render(
        "Little Market Town", True, DARK
    )
    screen.blit(title, (230, 40))

    # Draw coin counter
    coin_text = font.render(
        f"Coins: {coins}", True, DARK
    )
    screen.blit(coin_text, (100, 110))

    # Draw round number
    round_text = font.render(
        f"Round: {min(round_number, 3)}/3", True, DARK
    )
    screen.blit(round_text, (550, 110))

    # Draw message
    if round_number > 3:
        display_message = f"Game over! Final coins: {coins}"
    else:
        display_message = message

    text = font.render(display_message, True, DARK)
    screen.blit(text, (100, 165))

    # Draw investment buttons
    if round_number <= 3:
        colours = [GREEN, PINK, PURPLE]

        for i, button in enumerate(buttons):

            pygame.draw.rect(
                screen, colours[i], button,
                border_radius=20
            )

            name, loss, gain = options[str(i + 1)]

            label = font.render(
                f"{name}: -{abs(loss)} / +{gain}",
                True, DARK
            )

            screen.blit(label, (button.x + 30, button.y + 25))

    # Update the screen
    pygame.display.flip()

pygame.quit()
