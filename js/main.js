'use strict';

var COMMENTS_MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var PHOTO_DESCRIPTIONS = [
  'Тестим новую камеру!',
  'Просто фото...',
  'Улыбаемся и машем!',
  'Во время прогулки...',
  'Получилось случайно, но зато как!',
  'Где-то на окраине города'
];

var COMMENT_AUTORS_NAMES = [
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

var SCALE_STEP = 25;
var MAX_EFFECT_VALUE = 100;

var CHROME_COEFFICIENT = 0.01;
var SEPIA_COEFFICIENT = 0.01;
var PHOBOS_COEFFICIENT = 0.03;
var HEAT_COEFFICIENT = 0.02;

var photoSample = document.querySelector('#picture').content.querySelector('.picture');
var photosList = document.querySelector('.pictures');

var bigPhoto = document.querySelector('.big-picture');
var commentsContainer = bigPhoto.querySelector('.social__comments');
var commentsPlugs = commentsContainer.querySelectorAll('.social__comment');
var buttonCloseBigPhoto = bigPhoto.querySelector('.big-picture__cancel');

var uploadField = document.querySelector('.img-upload');
var imgUploadInput = uploadField.querySelector('.img-upload__input');
var buttonCloseUploadField = uploadField.querySelector('.img-upload__cancel');
var userUploadImg = uploadField.querySelector('.img-upload__preview img');

var scaleIndicator = uploadField.querySelector('.scale__control--value');
var buttonDecreaseImgScale = uploadField.querySelector('.scale__control--smaller');
var buttonIncreaseImgScale = uploadField.querySelector('.scale__control--bigger');

var effectSlider = uploadField.querySelector('.effect-level');
var pin = uploadField.querySelector('.effect-level__pin');
var effectScale = uploadField.querySelector('.effect-level__line');
var effectValueInput = uploadField.querySelector('.effect-level__value');
var effects = uploadField.querySelector('.effects');

var hashtagsInput = uploadField.querySelector('.text__hashtags');

// -------------------------------------ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ---------------------------------------------

// генерирует случайное число
var generateRandomNumber = function (min, max) {
  var randomNumber = Math.floor(min + Math.random() * (max + 1 - min));

  return randomNumber;
};

// сбрасывает все настройки изображения
var resetUserImgSettings = function () {
  effectSlider.classList.add('hidden');
  userUploadImg.removeAttribute('class');
  userUploadImg.removeAttribute('style');
  userUploadImg.style.transform = 'scale(' + MAX_EFFECT_VALUE / 100 + ')';
  scaleIndicator.value = MAX_EFFECT_VALUE + '%';
  effectValueInput.value = MAX_EFFECT_VALUE;
};

// удалаяет пробелы между хэш-тегами
var removeSpacesInHashtags = function (hashtags) {

  for (var i = 0; i < hashtags.length; i++) {
    if (hashtags[i] === '') {
      hashtags.splice(i, 1);
      i--;
    }
  }
};


// определяет наличие повторяющихся хэш-тегов вне зависимости от регистра
var detectDuplicateHashtag = function (hashtags) {
  var flag = false;

  for (var i = 0; i < hashtags.length; i++) {
    for (var j = i + 1; j < hashtags.length; j++) {
      if (hashtags[i].toLowerCase() === hashtags[j].toLowerCase()) {
        flag = true;
      }
    }
  }

  return flag;
};

// проверяет на валидность введенные хэш-теги
var validateHashtags = function (evt) {
  var hashtags = evt.target.value.split(' ');

  removeSpacesInHashtags(hashtags);

  var errorMessage = evt.target.setCustomValidity('');

  for (var i = 0; i < hashtags.length; i++) {
    if (hashtags[i][0] !== '#') {
      errorMessage = evt.target.setCustomValidity('Хэш-тег должен начинаться с символа "#"');
    } else if (hashtags[i] === '#') {
      errorMessage = evt.target.setCustomValidity('Хеш-тег не может состоять только из символа "#"');
    } else if (detectDuplicateHashtag(hashtags)) {
      errorMessage = evt.target.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
    } else if (hashtags.length > 5) {
      errorMessage = evt.target.setCustomValidity('Нельзя указать больше пяти хэш-тегов');
    } else if (hashtags[i].length > 20) {
      errorMessage = evt.target.setCustomValidity('Максимальная длина одного хэш-тега 20 символов, включая символ "#"');
    } else {
      errorMessage = errorMessage;
    }
  }
};

// меняет эффект на фото при нажатии на кнопку эффекта
var changeEffectsButton = function () {
  if (effects.querySelector('input:checked').value !== 'none') {
    effectSlider.classList.remove('hidden');
  }

  switch (effects.querySelector('input:checked').value) {
    case 'chrome':
      userUploadImg.classList.add('effects__preview--chrome');
      break;
    case 'sepia':
      userUploadImg.classList.add('effects__preview--sepia');
      break;
    case 'marvin':
      userUploadImg.classList.add('effects__preview--marvin');
      break;
    case 'phobos':
      userUploadImg.classList.add('effects__preview--phobos');
      break;
    case 'heat':
      userUploadImg.classList.add('effects__preview--heat');
      break;
  }
};

// меняет эффект на фото в зависимости от положения пина
var changeEffectsPin = function () {
  var effectValue = Math.round((pin.offsetLeft * 100) / effectScale.offsetWidth);

  effectValueInput.value = effectValue;

  switch (effects.querySelector('input:checked').value) {
    case 'chrome':
      userUploadImg.style.filter = 'grayscale(' + (effectValueInput.value * CHROME_COEFFICIENT) + ')';
      break;
    case 'sepia':
      userUploadImg.style.filter = 'sepia(' + (effectValueInput.value * SEPIA_COEFFICIENT) + ')';
      break;
    case 'marvin':
      userUploadImg.style.filter = 'invert(' + effectValueInput.value + '%)';
      break;
    case 'phobos':
      userUploadImg.style.filter = 'blur(' + (effectValueInput.value * PHOBOS_COEFFICIENT) + 'px)';
      break;
    case 'heat':
      userUploadImg.style.filter = 'brightness(' + (effectValueInput.value * HEAT_COEFFICIENT + 1) + ')';
      break;
  }
};

// увеличивает изображение
var increaseImg = function () {
  var valueScaleIndicator = Number(scaleIndicator.value.slice(0, scaleIndicator.value.length - 1));

  if (valueScaleIndicator < MAX_EFFECT_VALUE) {
    valueScaleIndicator += SCALE_STEP;
  }

  scaleIndicator.value = valueScaleIndicator + '%';
  userUploadImg.style.transform = 'scale(' + valueScaleIndicator / 100 + ')';
};

// уменьшает изображение
var decreaseImg = function () {
  var valueScaleIndicator = Number(scaleIndicator.value.slice(0, scaleIndicator.value.length - 1));

  if (valueScaleIndicator > SCALE_STEP) {
    valueScaleIndicator -= SCALE_STEP;
  }

  scaleIndicator.value = valueScaleIndicator + '%';
  userUploadImg.style.transform = 'scale(' + valueScaleIndicator / 100 + ')';
};

// -------------------------------------СОЗДАНИЕ КОММЕНТАРИЯ----------------------------------------------

// генерирует объект-комментарий
var generateComment = function () {
  var comment = {};

  comment.avatar = 'img/avatar-' + generateRandomNumber(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER) + '.svg';
  comment.message = COMMENTS_MESSAGES[generateRandomNumber(0, COMMENTS_MESSAGES.length - 1)];
  comment.autor = COMMENT_AUTORS_NAMES[generateRandomNumber(0, COMMENT_AUTORS_NAMES.length - 1)];

  return comment;
};

// генерирует массив объектов-комментариев
var generateComments = function () {
  var comments = [];
  comments.length = generateRandomNumber(0, MAX_COMMENTS_COUNT);

  for (var i = 0; i < comments.length; i++) {
    comments[i] = generateComment();
  }

  return comments;
};

// -------------------------------------СОЗДАНИЕ И ОТРИСОВКА МАЛЕНЬКИХ ФОТО----------------------------------------------

// генерирует объект-фотографию
var generatePhoto = function (photoNumber) {
  var photo = {};

  photo.url = 'photos/' + photoNumber + '.jpg';
  photo.description = PHOTO_DESCRIPTIONS[generateRandomNumber(0, PHOTO_DESCRIPTIONS.length - 1)];
  photo.likes = generateRandomNumber(MIN_LIKES_COUNT, MAX_LIKES_COUNT);
  photo.comments = generateComments();

  return photo;
};

// генерирует массив объектов-фотографий
var generatePhotos = function (photosCount) {
  var photos = [];

  for (var i = 0; i < photosCount; i++) {
    photos[i] = generatePhoto(i + 1);
  }

  return photos;
};

// отрисовывает фотографию по шаблону
var renderPhoto = function (photo) {
  var photoElement = photoSample.cloneNode(true);

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

renderPhotosList(generatePhotos(PHOTOS_COUNT));

// ------------------------ОТРИСОВКА БОЛЬШОЙ КАРТИНКИ--------------------------------

// генерирует шаблон комментария
var generateCommentSample = function (container) {
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

  commentsPlugs.forEach(function (commentPlug) {
    commentsContainer.removeChild(commentPlug);
  });

  for (var i = 0; i < photos[0].comments.length; i++) {
    generateCommentSample(commentsContainer);

    commentsContainer.querySelector('.social__comment').querySelector('img').src = photos[0].comments[i].avatar;
    commentsContainer.querySelector('.social__comment').querySelector('img').alt = photos[0].comments[i].autor;
    commentsContainer.querySelector('.social__text').textContent = photos[0].comments[i].message;
  }
};

bigPhoto.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPhoto.querySelector('.comments-loader').classList.add('visually-hidden');

// -----------------------------------ОБРАБОТЧИКИ----------------------------------------

// обработчик события нажатия на клавишу ESC
var onModalEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    onButtonCloseUploadFieldPress();
  }
};

// обработчик события клика на кнопку уменьшения изображения
var onButtonDecreaseImgClick = function () {
  decreaseImg();
};

// обработчик события клика на кнопку увеличения изображения
var onButtonIncreaseImgClick = function () {
  increaseImg();
};

// вычисление уровня насыщенности эффекта
var onPinMouseUp = function () {
  changeEffectsPin();
};

// смена эффекта по клику
var onEffectsItemClick = function () {
  resetUserImgSettings();

  changeEffectsButton();
};

// обрабатывает изменения значения инпута для хэш-тегов
var onHashtagsInputChange = function (evt) {
  validateHashtags(evt);
};

// обработчик события focus на поле ввода хэш-тега
var onInputHashtagFocus = function () {
  document.removeEventListener('keydown', onModalEscPress);
};

// открывает окно редактирования
var onInputUploadChange = function () {
  uploadField.querySelector('.img-upload__overlay').classList.remove('hidden');

  document.addEventListener('keydown', onModalEscPress);

  hashtagsInput.addEventListener('focus', onInputHashtagFocus);
  hashtagsInput.addEventListener('blur', function () {
    document.addEventListener('keydown', onModalEscPress);
  });

  resetUserImgSettings();
};

// закрывает окно редактирования
var onButtonCloseUploadFieldPress = function () {
  uploadField.querySelector('.img-upload__overlay').classList.add('hidden');

  document.removeEventListener('keydown', onModalEscPress);

  imgUploadInput.value = '';

  resetUserImgSettings();
};

// ----------------------------------СОБЫТИЯ------------------------------------------

// открытие окна редактирования фото при изменении значения инпута загрузки
imgUploadInput.addEventListener('change', onInputUploadChange);

// закрытие окна редактирования фото при клике на кнопку закрытия
buttonCloseUploadField.addEventListener('click', onButtonCloseUploadFieldPress);

// уменьшение изображения при клике на кнопку "-"
buttonDecreaseImgScale.addEventListener('click', onButtonDecreaseImgClick);

// увеличение изображения при клике на кнопку "+"
buttonIncreaseImgScale.addEventListener('click', onButtonIncreaseImgClick);

// изменение уровня насыщенности эффекта при отжатии ЛКМ
pin.addEventListener('mouseup', onPinMouseUp);

// изменение эффекта фото при клике
effects.addEventListener('click', onEffectsItemClick);

// событие изменения значения инпута для хэш-тегов
hashtagsInput.addEventListener('change', onHashtagsInputChange);


// ---------------ВРЕМЕННО------------------------------------

// закрывает большую фотку
var closeBigPhoto = function () {
  bigPhoto.classList.add('hidden');
};

// показывает полноразмерное фото при клике на миниатюру
photosList.addEventListener('click', function (evt) {
  if (evt.target.classList.contains('picture__img')) {
    renderBigPhoto(generatePhotos(PHOTOS_COUNT));
  }
});

// закрывает полноразмерное фото при клике на кнопку закрытия
buttonCloseBigPhoto.addEventListener('click', closeBigPhoto);
