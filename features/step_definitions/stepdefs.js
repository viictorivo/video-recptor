const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

function uploadVideo(video) {
    return 'is send'
  }

Given('I send the video', function () {
    this.video = "is send"
  });

When('I click send video', function () {
    this.order = uploadVideo(this.video)
  });

Then('My video {string}', function (videoUploaded) {
    assert.strictEqual(this.video, videoUploaded);
  });