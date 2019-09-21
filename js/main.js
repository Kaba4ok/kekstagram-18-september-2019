'use strict';

var COMMENTS_MESSAGE = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var PHOTO_DESCRIPTION = [
  'Тестим новую камеру!',
  'Просто фото...',
  'Улыбаемся и машем!',
  'Во время прогулки...',
  'Получилось случайно, но зато как!',
  'Где-то на окраине города'
];

var COMMENT_AUTOR_NAME = [
  'Петя',
  'Саша',
  'Маша',
  'Коля',
  'Даша',
  'Лена'
];

var MIN_AVATAR_NUMBER = 1;
var MAX_AVATAR_NUMBER = 6;
var MAX_COMMENTS_COUNT = 5;
var MIN_LIKES_COUNT = 15;
var MAX_LIKES_COUNT = 200;
var PHOTOS_COUNT = 25;

var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');
var photosList = document.querySelector('.pictures');

// генерирует случайное число
var generateRandomNumber = function (min, max) {
  var randomNumber = Math.floor(min + Math.random() * (max + 1 - min));

  return randomNumber;
};

// генерирует объект-комментарий
var generateCommentObject = function () {
  var commentObject = {};

  commentObject.avatar = 'img/avatar-' + generateRandomNumber(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER) + '.svg';
  commentObject.message = COMMENTS_MESSAGE[generateRandomNumber(0, COMMENTS_MESSAGE.length - 1)];
  commentObject.name = COMMENT_AUTOR_NAME[generateRandomNumber(0, COMMENT_AUTOR_NAME.length - 1)];

  return commentObject;
};

// генерирует массив объектов-комментариев
var generateCommentsObjectsArray = function () {
  var commentsObjectsArray = [];
  commentsObjectsArray.length = generateRandomNumber(0, MAX_COMMENTS_COUNT);

  for (var i = 0; i < commentsObjectsArray.length; i++) {
    commentsObjectsArray[i] = generateCommentObject();
  }

  return commentsObjectsArray;
};

// генерирует объект-фотографию
var generatePhotoObject = function (photoNumber) {
  var photoObject = {};

  photoObject.url = 'photos/' + photoNumber + '.jpg';
  photoObject.description = PHOTO_DESCRIPTION[generateRandomNumber(0, PHOTO_DESCRIPTION.length - 1)];
  photoObject.likes = generateRandomNumber(MIN_LIKES_COUNT, MAX_LIKES_COUNT);
  photoObject.comments = generateCommentsObjectsArray();

  return photoObject;
};

// генерирует массив объектов-фотографий
var generatePhotosObjectsArray = function (photosCount) {
  var photosObjectsArray = [];

  for (var i = 0; i < photosCount; i++) {
    photosObjectsArray[i] = generatePhotoObject(i + 1);
  }

  return photosObjectsArray;
};

// отрисовывает фотографию по шаблону
var renderPhoto = function (photo) {
  var photoElement = photoTemplate.cloneNode(true);

  photoElement.querySelector('img').src = photo.url;
  photoElement.querySelector('.picture__likes').textContent = photo.likes;
  photoElement.querySelector('.picture__comments').textContent = photo.comments.length;

  return photoElement;
};

// отрисовывает фотографии в блок .picture
var renderPhotosList = function (photos) {
  var fragment = document.createDocumentFragment();

  photos.forEach(function (photo) {
    fragment.appendChild(renderPhoto(photo));
  });

  photosList.appendChild(fragment);
};

renderPhotosList(generatePhotosObjectsArray(PHOTOS_COUNT));

// ------------------------ОТРИСОВКА БОЛЬШОЙ КАРТИНКИ--------------------------------

var bigPhoto = document.querySelector('.big-picture');
var commentsContainer = bigPhoto.querySelector('.social__comments');
var commentsDefault = commentsContainer.querySelectorAll('.social__comment');

// генерирует шаблон комментария
var generateCommentTemplate = function (container) {
  container.insertAdjacentHTML('afterbegin',
      '<li class="social__comment">' +
        '<img class="social__picture" width="35" height="35">' +
        '<p class="social__text"></p>' +
      '</li>'
  );
};

// отрисовывает блок с большой фотографией
var renderBigPhoto = function (photos) {
  bigPhoto.classList.remove('hidden');

  bigPhoto.querySelector('.big-picture__img').querySelector('img').src = photos[0].url;
  bigPhoto.querySelector('.likes-count').textContent = photos[0].likes;
  bigPhoto.querySelector('.comments-count').textContent = photos[0].comments.length;
  bigPhoto.querySelector('.social__caption').textContent = photos[0].description;

  commentsDefault.forEach(function (comment) {
    comment.style.display = 'none';
  });

  for (var i = 0; i < photos[0].comments.length; i++) {
    generateCommentTemplate(commentsContainer);

    commentsContainer.querySelector('.social__comment').querySelector('img').src = photos[0].comments[i].avatar;
    commentsContainer.querySelector('.social__comment').querySelector('img').alt = photos[0].comments[i].name;
    commentsContainer.querySelector('.social__text').textContent = photos[0].comments[i].message;
  }
};

bigPhoto.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPhoto.querySelector('.comments-loader').classList.add('visually-hidden');

renderBigPhoto(generatePhotosObjectsArray(PHOTOS_COUNT));
