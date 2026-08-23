const fs = require('fs');
const cheerio = require('cheerio');

const templateHtml = fs.readFileSync('../course_site/af/ad_app/sin/sn/3267/index.html', 'utf8');
const $ = cheerio.load(templateHtml);

// Clear main content
let contentContainer = $('.panel_main').parent();
if (!contentContainer.length) contentContainer = $('#contents_box');
contentContainer.empty();

// Set Title
$('#contents_title').html('<i class="fa fa-file-text-o"></i> 신청자관리 <br /><span class="title">광주풍향초등학교 늘봄학교</span>');
$('title').text('추가/취소자조회 - 신청자관리 - 늘봄학교');

// Add the content from dbdbschool_add_cancel_inquiry.html
const inquiryHtml = fs.readFileSync('dbdbschool_add_cancel_inquiry.html', 'utf8');
const $inquiry = cheerio.load(inquiryHtml);
const panel = $inquiry('.panel_main').parent().html();
contentContainer.append(panel);

// Make the directory and save the file
fs.mkdirSync('../course_site/af/ad_app/com/sn/3267', { recursive: true });
fs.writeFileSync('../course_site/af/ad_app/com/sn/3267/index.html', $.html());
console.log('Saved to course_site/af/ad_app/com/sn/3267/index.html');
