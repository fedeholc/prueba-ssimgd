import { JSDOM } from "jsdom";


export async function POST(req: Request) {

  /* const response = await fetch("https://www.google.com");
  const html = await response.text(); */

  const body = await req.json();
  if (!body) {
    return Response.json({ message: "No se envió el body" });
  }
  if (!body.url) {
    return Response.json({ message: "No se envió la url" });
  }
  const url = body.url;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch(url);
        const html = await response.text();

        const dom = new JSDOM(html);
        const document = dom.window.document;

        const imageElements = document.querySelectorAll('img');

        for (let index = 0; index < imageElements.length; index++) {
          const img = imageElements[index];
          const imageUrl = img.src;
          const absoluteImageUrl = new URL(imageUrl, url).href;
          console.log("mando: ", absoluteImageUrl);



          controller.enqueue(
            JSON.stringify({
              index,
              url: absoluteImageUrl
            }) + '\n'
          );

          //generate a 1s delay
          await new Promise((resolve) => setTimeout(resolve, 10));

        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/json',
      'Transfer-Encoding': 'chunked'
    }
  });/* 
  // get subpages using jsdom
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const subPages = new Set<string>();
  const links = document.querySelectorAll("a");
  console.log("Subpaginas:", links)
  links.forEach((link) => {
    const href = link.getAttribute("href");

    if (href) {
      subPages.add(href);
      console.log("Agregada:", href);

    }
  });

  console.log("rta:", subPages);
  return Response.json({ message: "Hola", rta: Array.from(subPages as Set<string>) }); */
}