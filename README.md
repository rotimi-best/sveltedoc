<p align="center">
  <a href="https://sveltedoc.xyz">
    <img src="https://sveltedoc.xyz/logo_192.png" height="128">
    <h1 align="center">SvelteDoc</h1>
  </a>
</p>

## What is SvelteDoc?

Think of Google doc (without the whole collaboration complexity) with a twist that all the documents you create are open to everyone to find and leave comments.

Something like youtube but for documents or github gists. Making it public by default sounds wierd however I believe open source and collaboration is becoming the acceptable norm.

<p align="center">
  <img src="https://user-images.githubusercontent.com/31730715/128576153-ea1d314e-5dbf-4d62-b85b-4b9bbbf21af0.png" height="200">
</p>

## Why does it matter?

I studied computer science in russian language and as a foreign student it was diffcult for me to keep up with the lecturer while he/she dictates during a lecture. In order to stay up to date I would ask for the notebook of a course mate or take a picture of everything written by that student, then when I got home, I would have to copy everything into my notebook. 

<p align="center">
  <img src="https://user-images.githubusercontent.com/31730715/128576003-a2434728-752e-454e-aefc-954a028731e8.png" height="200">
</p>

This was so time consuming and I don't want anyone to have to go through this. My idea was what if every note taking by all students in the lesson is made public to everyone? I have been thinking about this project for a long time now and I felt now is the best time to build the MVP.

## Demo
https://user-images.githubusercontent.com/31730715/128574952-44da5ad0-4c14-4c26-b0ed-ec0cb03af92e.mp4


You can also visit [https://sveltedoc.xyz](https://sveltedoc.xyz) to try it out for your self

## TechStack

- UI - Svelte w/ SvelteKit
- Backend (and every other good thing) - Supabase.

<p align="center">
  <img src="https://user-images.githubusercontent.com/31730715/128576567-f554bfc9-27b8-4e8c-bae7-b89c6f1c866e.png" height="200">
</p>

## Features implemented

- Magic link authentication (Auth)
- Search for documents - only by title (Data)
- View in realtime comments increment count on documents list page (Realtime)
- CRUD your documents -(Data)
- View other documents + leave comments and view other comments in real time (Realtime)
- View documents and edit your username + a default avatar (hosted on supbase storage)

## Run Locally

To run it locally you will need to setup a supbase project with all my settings and configurations which can be tricky - if need be I can give the judges access to the project. However the `.env` file requires 2 variables

<p align="center">
  <img src="https://i.imgflip.com/12dasr.jpg" height="200">
</p>

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## In conclusion
<p align="center">
  <img src="https://sayingimages.com/wp-content/uploads/well-looks-like-we-winner-meme.jpg" height="200">
</p>

