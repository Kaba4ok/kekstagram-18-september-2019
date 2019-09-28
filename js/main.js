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

var ESC_KEYCODE = 27;
// var ENTER_KEYCODE = 13;

var SCALE_STEP = 25;
var MAX_EFFECT_VALUE = 100;

var CHROME_COEFFICIENT = 0.01;
var SEPIA_COEFFICIENT = 0.01;
var PHOBOS_COEFFICIENT = 0.03;
var HEAT_COEFFICIENT = 0.02;

var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');
var photosList = document.querySelector('.pictures');

var uploadField = document.querySelector('.img-upload');
var imgUploadInput = uploadField.querySelector('.img-upload__input');
var buttonCloseUploadField = uploadField.querySelector('.img-upload__cancel');
var userUploadImg = uploadField.querySelector('.img-upload__preview img');

var scaleValueInput = uploadField.querySelector('.scale__control--value');
var buttonDecreaseImgScale = uploadField.querySelector('.scale__control--smaller');
var buttonIncreaseImgScale = uploadField.querySelector('.scale__control--bigger');

var pin = uploadField.querySelector('.effect-level__pin');
var effectScale = uploadField.querySelector('.effect-level__line');
var effectValueInput = uploadField.querySelector('.effect-level__value');
var effects = uploadField.querySelector('.effects');

// ----------------------------------------------------------------------------------------------------------

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

/* var bigPhoto = document.querySelector('.big-picture');
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
    commentsContainer.removeChild(comment);
  });

  for (var i = 0; i < photos[0].comments.length; i++) {
    generateCommentTemplate(commentsContainer);

    commentsContainer.querySelector('.social__comment').querySelector('img').src = photos[0].comments[i].avatar;
    commentsContainer.querySelector('.social__comment').querySelector('img').alt = photos[0].comments[i].name;
    commentsContainer.querySelector('.social__text').textContent = photos[0].comments[i].message;
  }
};

bigPhoto.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPhoto.querySelector('.comments-loader').classList.add('visually-hidden');*/

// renderBigPhoto(generatePhotosObjectsArray(PHOTOS_COUNT));

// сбрасывает все настройки изображения
var resetUserImgSettings = function () {
  userUploadImg.removeAttribute('class');
  userUploadImg.removeAttribute('style');
  userUploadImg.style.transform = 'scale(' + MAX_EFFECT_VALUE / 100 + ')';
  scaleValueInput.value = MAX_EFFECT_VALUE + '%';
  effectValueInput.value = MAX_EFFECT_VALUE;
  imgUploadInput.value = '';
};

// -----------------------------------ОБРАБОТЧИКИ----------------------------------------

// обработчик события нажатия на клавишу ESC
var onModalEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeUploadField();
  }
};

// обработчик события клика на кнопку уменьшения изображения
var onButtonDecreaseImgScale = function () {
  var valueInput = Number(scaleValueInput.value.slice(0, scaleValueInput.value.length - 1));

  if (valueInput > SCALE_STEP) {
    valueInput -= SCALE_STEP;
  }

  scaleValueInput.value = valueInput + '%';
  userUploadImg.style.transform = 'scale(' + valueInput / 100 + ')';
};

// обработчик события клика на кнопку увеличения изображения
var onButtonIncreaseImgScale = function () {
  var valueInput = Number(scaleValueInput.value.slice(0, scaleValueInput.value.length - 1));

  if (valueInput < MAX_EFFECT_VALUE) {
    valueInput += SCALE_STEP;
  }

  scaleValueInput.value = valueInput + '%';
  userUploadImg.style.transform = 'scale(' + valueInput / 100 + ')';
};

// вычисление уровня насыщенности эффекта
var onPinMouseUp = function () {
  var effectValue = Math.round((pin.offsetLeft * 100) / effectScale.offsetWidth);

  effectValueInput.value = effectValue;
};

// смена эффекта по клику
var onEffectsItemClick = function (effectItem) {

  resetUserImgSettings();

  var effectName = effectItem.value;

  switch (effectName) {
    case 'chrome':
      userUploadImg.classList.add('effects__preview--chrome');
      userUploadImg.style.filter = 'grayscale(' + (effectValueInput.value * CHROME_COEFFICIENT) + ')';
      break;
    case 'sepia':
      userUploadImg.classList.add('effects__preview--sepia');
      userUploadImg.style.filter = 'sepia(' + (effectValueInput.value * SEPIA_COEFFICIENT) + ')';
      break;
    case 'marvin':
      userUploadImg.classList.add('effects__preview--marvin');
      userUploadImg.style.filter = 'invert(' + effectValueInput.value + ')';
      break;
    case 'phobos':
      userUploadImg.classList.add('effects__preview--phobos');
      userUploadImg.style.filter = 'blur(' + (effectValueInput.value * PHOBOS_COEFFICIENT) + 'px)';
      break;
    case 'heat':
      userUploadImg.classList.add('effects__preview--heat');
      userUploadImg.style.filter = 'brightness(' + (effectValueInput.value * HEAT_COEFFICIENT + 1) + ')';
      break;
  }
};

// открывает окно редактирования
var openUploadField = function () {
  uploadField.querySelector('.img-upload__overlay').classList.remove('hidden');

  document.addEventListener('keydown', onModalEscPress);

  resetUserImgSettings();
};

// закрывает окно редактирования
var closeUploadField = function () {
  uploadField.querySelector('.img-upload__overlay').classList.add('hidden');
  document.removeEventListener('keydown', onModalEscPress);

  resetUserImgSettings();
};

// ----------------------------------СОБЫТИЯ------------------------------------------

// открытие окна редактирования фото при изменении значения инпута загрузки
imgUploadInput.addEventListener('change', openUploadField);

// закрытие окна редактирования фото при клике на кнопку закрытия
buttonCloseUploadField.addEventListener('click', closeUploadField);

// уменьшение изображения при клике на кнопку "-"
buttonDecreaseImgScale.addEventListener('click', onButtonDecreaseImgScale);

// увеличение изображения при клике на кнопку "+"
buttonIncreaseImgScale.addEventListener('click', onButtonIncreaseImgScale);

// изменение уровня насыщенности эффекта при отжатии ЛКМ
pin.addEventListener('mouseup', onPinMouseUp);

// изменение эффекта фото при клике
effects.addEventListener('click', function (evt) {
  onEffectsItemClick(evt.target);
});
