# Brisa Frontend

This is the BrisaBoards JavaScript frontend.

## For users

You can download this code to run it directly from your laptop. It is a simple way to try out Brisa.

A distribution download will be available soon that you can unzip and open in your browser to try it out.

While your browser will save the data so you can come back to it, it is _not_ recommended that you use this to store information you're not afraid of losing. If your browser profile becomes corrupted, you need to reinstall, or your laptop just stops working, you will lose your data!

## For developers

It's pretty easy to get started if you'd like to view or improve the Brisa frontend code. This frontend uses npm and poi to build and develop.

In addition, the default "backend" uses browser-based IndexedDB storage, so:

1. Once you run poi develop, the server will start and no backend is needed, and changes you make auto-reload the page.
2. If you run poi build --public_path '', you can open the index.html file in your browser.

## For installers

You can run the Brisa backend (not released yet, Aug 2018) anywhere you can run Ruby on Rails (Digital Ocean, AWS, your laptop) and postgresql.

Once the backend is live, a link will be provided here to get started with it.
