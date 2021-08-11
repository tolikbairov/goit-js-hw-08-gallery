"use strict";
const galleryItems = [
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/14/16/43/himilayan-blue-poppy-4202825__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/14/16/43/himilayan-blue-poppy-4202825_1280.jpg",
    description: "Hokkaido Flower",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677_1280.jpg",
    description: "Container Haulage Freight",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785_1280.jpg",
    description: "Aerial Beach View",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_1280.jpg",
    description: "Flower Blooms",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334_1280.jpg",
    description: "Alpine Mountains",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571_1280.jpg",
    description: "Mountain Lake Sailing",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272_1280.jpg",
    description: "Alpine Spring Meadows",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255_1280.jpg",
    description: "Nature Landscape",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843_1280.jpg",
    description: "Lighthouse Coast Sea",
  },
];

// Объект с ссылками на HTML элементы
const refs = {
  gallery: document.querySelector(".gallery.js-gallery"),
  modal: document.querySelector(".lightbox"),
  modalCloseBtn: document.querySelector('[data-action="close-lightbox"]'),
  modalImage: document.querySelector(".lightbox__image"),
  lightboxOverlay: document.querySelector(".lightbox__overlay"),
};

//Создает HTML строку из массива imageArray <li><a><image></image></a></li>
const createItemsString = (
  imageArray,
  liClassName,
  linkClassName,
  ImageClassName
) => {
  return imageArray.reduce(
    (itemsString, { preview, original, description }) => {
      itemsString += `<li class="${liClassName}"><a
    class="${linkClassName}"
    href="${original}">
    <img
    class="${ImageClassName}"
    src="${preview}"
    data-source="${original}"
    alt="${description}"
    />
    </a>
    </li>`;
      return itemsString;
    },
    ""
  );
};
//Создаем HTML элементы для галлереи
refs.gallery.insertAdjacentHTML(
  "afterbegin",
  createItemsString(
    galleryItems,
    "gallery__item",
    "gallery__link",
    "gallery__image"
  )
);

//Изменяет текущий атрибут src и alt для картинки в модальном окне
const setModalImg = (newImgSrc = "", alt = "") => {
  refs.modalImage.setAttribute("src", `${newImgSrc}`);
  refs.modalImage.setAttribute("alt", `${alt}`);
};

/////////////Создаем Обьект который хранит текущий li элемент
const listElemObj = {
  currentListEl: "",

  //Возращает ссылку на картинку из элемента списка
  getImageAttr(liElement) {
    let image = liElement.querySelector(".gallery__image");

    return {
      src: image.getAttribute("data-source"),
      alt: image.getAttribute("alt"),
    };
  },
  getImageSrc(liElement) {
    return liElement.querySelector(".gallery__link").getAttribute("href");
  },

  //Возращает ссылку на следующую картинку,в direction (направление в котором двигаемся) передаем next или previous
  getNextImageAttr(direction) {
    let nextListEl = this.getNextListEl(direction);

    let nextImgAttr;
    if (!nextListEl) {
      //Исключение на случай, если элемент будет крайний
      switch (direction) {
        case "next":
          nextListEl = this.getFirstListEl();
          break;
        case "previous":
          nextListEl = this.getLastListEl();
          break;
        default:
          return;
      }
    }
    nextImgAttr = this.getImageAttr(nextListEl);
    this.setCurrentLi(nextListEl);
    return nextImgAttr;
  },
  //Изменяем текущий элемент списка
  setCurrentLi(newListEl) {
    this.currentListEl = newListEl;
  },
  // возращает следующий элемент списка
  getNextListEl(direction) {
    return this.currentListEl[`${direction}ElementSibling`];
  },
  //возращает первый элемент списка
  getFirstListEl() {
    return refs.gallery.firstElementChild;
  },
  //возращает последний элемент списка
  getLastListEl() {
    return refs.gallery.lastElementChild;
  },
};
//открытие модального окна
const openModal = (event) => {
  //Сбрасываем дефолтные обработчики событий
  event.preventDefault();

  listElemObj.setCurrentLi(event.target.closest("li"));
  //Проверяем элемент на котором был клик
  if (event.target.nodeName !== "IMG") {
    return;
  }
  setModalImg(event.target.dataset.source, event.target.getAttribute("alt"));
  refs.modal.classList.add("is-open");
};

// закрытие модального окна
const closeModal = () => {
  refs.modal.classList.remove("is-open");
  listElemObj.setCurrentLi("");
  setModalImg("", "");
};

refs.modalCloseBtn.addEventListener("click", () => {
  closeModal();
});
refs.gallery.addEventListener("click", (event) => {
  openModal(event);
});
refs.lightboxOverlay.addEventListener("click", closeModal);
window.addEventListener("keydown", (event) => {
  ///
  if (refs.modal.classList.contains("is-open")) {
    let newImgAttr;
    switch (event.code) {
      case "Escape":
        closeModal();
        break;
      case "ArrowRight":
        newImgAttr = listElemObj.getNextImageAttr("next");
        setModalImg(newImgAttr.src, newImgAttr.alt);
        break;
      case "ArrowLeft":
        newImgAttr = listElemObj.getNextImageAttr("previous");
        setModalImg(newImgAttr.src, newImgAttr.alt);
        break;
      default:
        return;
    }
  }
});
