'use strict';

(function () {

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

  window.data = {
    commentsMessage: COMMENTS_MESSAGES,
    photoDescription: PHOTO_DESCRIPTIONS,
    commentAutorName: COMMENT_AUTORS_NAMES
  };

})();
