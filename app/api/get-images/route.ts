import { JSDOM } from "jsdom";


async function getImagesUrls(sourceUrl: string): Promise<string[] | undefined> {
  try {
    const response = await fetch(sourceUrl);
    const html = await response.text();


    const dom = new JSDOM(html);
    const document = dom.window.document;
    const uniqueImgUrls = new Set<string>();
    const imgs = document.querySelectorAll("img");

    imgs.forEach((img) => {
      const src = img.getAttribute("src");
      if (src) {
        if (src && !src.startsWith("http")) {
          const url = new URL(sourceUrl);
          const link = url.origin + src;
          uniqueImgUrls.add(link);
        } else {
          uniqueImgUrls.add(src);
        }
      }


      //busca imagenes tambien en srcset
      const srcSet = img.getAttribute('srcset');
      if (srcSet) {
        const srcArray = srcSet.split(",");
        const srcArray2 = srcArray.map((item) => {
          return item.trim().split(" ")[0];
        });

        srcArray2.forEach(element => {
          if (element && !element.startsWith("http")) {
            const url = new URL(sourceUrl);
            const link = url.origin + src;
            uniqueImgUrls.add(link);
          } else {
            uniqueImgUrls.add(element);
          }

        }
        );
      }
    });


    //incluí también imagenes que vienen en links
    const aimgs = document.querySelectorAll("a");
    aimgs.forEach((aimg) => {
      let hrefs = aimg.getAttribute("href");
      if (hrefs && !hrefs.startsWith("http")) {
        const url = new URL(sourceUrl);
        hrefs = url.origin + hrefs;
      }

      if (hrefs) {
        if (hrefs.endsWith(".jpg") || hrefs.endsWith(".jpeg") || hrefs.endsWith(".png") || hrefs.endsWith(".gif")) {

          uniqueImgUrls.add(hrefs);
        }
      }
    });

    console.log("Unique Images:", uniqueImgUrls.size);

    return Array.from(uniqueImgUrls);
  } catch {
    console.error(`Error processing page ${sourceUrl}`);
  }
}



export async function POST(request: Request) {
  const { url } = await request.json();

  let imageLinks: string[] | undefined = [];

  imageLinks = await getImagesUrls(url);

  return Response.json(imageLinks || null);
}