En _Dash SPA_ y _Dash Server components_ está la misma prueba de funcionalidad:

- en el primer caso con una app tipo SPA del lado del cliente y haciendo consulta a los endpoints acá mismo en next
- en el segundo intentando hacer lo mismo usando server components junto con server actions en lugar de endpoints, a su vez dentro de dash-server en la parte de edición de sources hay dos componentes:
  - ItemForm edita el nombre del source usando la server action desde un botón
  - ItemForm2 hace lo mismo pero con un formulario y usando ademas useActionState para tener control del estado de la request y su respuesta.
  - En el primer caso tambien manejo el estado pero con mi usestate propio. En ambos casos despues de guardar el update se hace un revalidate para que se actualice tanto los elementos de la pagina del item como la lista del costado con el nombre actualizado.

---

- probar react query
- probar redux https://redux.js.org/tutorials/fundamentals/part-1-overview#redux-basics

- validaciones de esquema en mongo
  https://chatgpt.com/c/6759fc8f-1ff0-8008-90ed-7ab7c5ccef1d
- validar con zod?
- donde obtener el tamaño de las imagenes? en back o en front?

- convendría separar una primera descarga de toda la info de imagenes sin filtrar, guardarlo a una colección y luego hacer el filtrado a partir de esos datos? (quedando la opción a hacer un update o checkeo de si todo eso está bien)

- Pasos para nuevo Source

  - Ingresa nombre y url
  - Descarga páginas e imagenes
  - Ahora puede:
    - Guardar toda esa info
    - Redescargar la info
    - Editar nombre, url, etc.
  - Aplicar filtros a lo descargado
    - Los filtros tendrían que ser como capas que se aplican o no.
    - Tendría que haber una opcion para elegir si se muestra tachado lo filtrado o si no se muestra.
    - Lo resultante del filtrado debería guardarse como playlist.
