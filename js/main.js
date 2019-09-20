'use strict';

var COMMENTS_MESSAGE = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
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

  commentObject.avatar = 'avatar-' + generateRandomNumber(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER) + '.svg';
  commentObject.message = COMMENTS_MESSAGE[generateRandomNumber(0, COMMENTS_MESSAGE.length)];
  commentObject.name = COMMENT_AUTOR_NAME[generateRandomNumber(0, COMMENT_AUTOR_NAME.length)];

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
  photoObject.description = 'Что то там про фотку и все такое...';
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
