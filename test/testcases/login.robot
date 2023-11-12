*** Settings ***
Resource                ../keywords/common.robot
Test Setup              Setup
Test Teardown           Tear Down

*** Test Cases ***
#DN-01 Verify that Đăng nhập successfully with valid Email and Mật khẩu
#  [Tags]                @smoketest               @regression
#  Then Login to admin
#
#DN-02 Verify that Login unsuccessfully with invalid Email
#  [Tags]                @smoketest               @regression
#  When Enter "email" in "Tên đăng nhập" with "_RANDOM_"
#  When Enter "text" in "Mật khẩu" with "Password1!"
#  When Click "Đăng nhập" button
#  Then User look message "Người dùng _@Tên đăng nhập@_ không tồn tại!" popup
#
#DN-03 Verify that Đăng nhập unsuccessfully with invalid Email
#  [Tags]                @smoketest               @regression
#  When Enter "email" in "Tên đăng nhập" with "admin@admin.com"
#  When Enter "text" in "Mật khẩu" with "Password1!!"
#  When Click "Đăng nhập" button
#  Then User look message "Thông tin đăng nhập không hợp lệ cho người dùng _@Tên đăng nhập@_" popup

DN-04 Verify that Đăng nhập unsuccessfully with invalid Mật khẩu
  [Tags]                @smoketest               @regression
  When Click "Đăng nhập" button
  Then Required message "Tên đăng nhập" displayed under "Xin vui lòng nhập tên đăng nhập" field
  Then Required message "Mật khẩu" displayed under "Xin vui lòng nhập mật khẩu" field

DN-05 Verify that Đăng nhập unsuccessfully because no enter Email
  [Tags]                @smoketest               @regression
  When Enter "text" in "Mật khẩu" with "123123"
  When Click "Đăng nhập" button
  Then Required message "Tên đăng nhập" displayed under "Xin vui lòng nhập tên đăng nhập" field

DN-06 Verify that Đăng nhập unsuccessfully because no enter Password
  [Tags]                @smoketest               @regression
  When Enter "email" in "Tên đăng nhập" with "admin@gmail.com"
  When Click "Đăng nhập" button
  Then Required message "Mật khẩu" displayed under "Xin vui lòng nhập mật khẩu" field
