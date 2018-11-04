# BrisaBoards Frontend

Brisa is a web-based organizer app designed with a few main ideas:

1. You should have access to tools designed for the task at hand, accomplished so far with Kanbans, Sheets, and Whiteboards.
2. Cards are the important part, and building on a card should be easy. Any card, anywhere, can become a new board (Kanban, Sheet, Whiteboard).
3. Labels (and tags) allow you to group ideas, and Models allow you to expand on them.

Learn more at https://BrisaBoards.com.

## For Users

If you just want to try out BrisaBoards, you can go to https://BrisaBoards.com/preview/. There is no signup process, and the data is stored in your browser, not on Brisa servers.

If you would like to install a full Brisa server, check out For Installers below.

You can also [Download the Demo](https://brisaboards.com/download.html) to run it directly from your laptop. It is a simple way to try out Brisa.

While your browser will save the data so you can come back to it, it is _not_ recommended that you use this to store information you would be afraid of losing. If your browser profile becomes corrupted, you need to reinstall, or your laptop just stops working, you will lose your data!

## For Developers

Testing or modifying the frontend is _very_ easy. Here's the recommended way to start:

1. Clone this repository and change to the brisa-frontend directory.
2. Run npm install. This will take a minute (poi, a zero-conf JS build tool, has quite a few dependencies).
3. Run poi develop.

After that, poi should tell you a server is running on http://localhost:4000. If you make changes, it is pretty good about displaying them automatically, but you may need to reload the page occasionally.

The wiki is lacking, but it has a brief overview of the frontend structure, as well as a very poorly-formatted API intro.

The backend is being converted from a hacked-together Ruby Rack app to a Ruby on Rails app. Expect the backend repository to be up shortly with details about how to run the two together.

## For Installers

You can run the Brisa backend anywhere you can run Ruby on Rails and PostgreSQL. It should work fine on a minimal virtual server through DigitalOcean, AWS, or any other cloud providder. Check out the [downloads page](https://brisaboards.com/downloads.html) for the current version and install instructions.
