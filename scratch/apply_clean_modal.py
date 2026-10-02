# -*- coding: utf-8 -*-
import os

modal_html = '''  <!-- ==================== 37. 수강자등록 모달 (공식 서식 1:1 정밀 매핑) ==================== -->
  <div id="modal_sub_app_register" class="modal" style="display:none; position:fixed !important; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); z-index:99999 !important; align-items:center; justify-content:center;">
    <div class="modal-box" style="margin:auto !important; position:relative !important; background:#ffffff; border-radius:6px; width:92%; max-width:720px; max-height:92vh; overflow-y:auto; box-shadow:0 10px 25px rgba(0,0,0,0.25); border:1px solid #cbd5e1;">
      <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 18px; border-bottom:1px solid #e2e8f0; background:#f8fafc; border-radius:6px 6px 0 0;">
        <h4 style="margin:0; font-size:15px; font-weight:bold; color:#1e293b;">수강자 등록</h4>
        <button type="button" onclick="closeSubsidyAppRegisterModal();" style="border:none; background:transparent; font-size:20px; cursor:pointer; color:#64748b; line-height:1;">&times;</button>
      </div>
      <div style="padding:16px 20px;">
        <p style="margin:0 0 10px 0; font-size:12px;"><i class="fa fa-check-square-o" style="color:#2563eb;" title="필수항목"></i><span style="font-size:12px; color:#333;"> 표시가 있는 항목은 반드시 입력해야 합니다.</span></p>
        <form name="fm_edit" id="fm_edit" onsubmit="event.preventDefault(); return fm_edit_check(this);" method="post" accept-charset="utf-8">
          <input type="hidden" name="app_num" id="app_num" value="">
          <input type="hidden" id="sub_app_reg_applicant_id" value="">
          <table class="table table-bordered list MAT0 db-table" style="width:100%; border-collapse:collapse; margin-bottom:12px;">
            <tbody>
              <tr>
                <th colspan="2" style="background:#f8fafc; border:1px solid #ddd; padding:8px 12px; text-align:left; font-weight:bold; font-size:12px;">대상 월 <span><i class="fa fa-check-square-o" style="color:#2563eb;"></i></span></th>
                <td style="border:1px solid #ddd; padding:8px 12px;">
                  <select name="month" id="month" class="form-control" style="width:100px; height:30px; line-height:normal !important; box-sizing:border-box !important; vertical-align:middle; padding:0 24px 0 10px; border:1px solid #ccc; border-radius:3px; font-size:12px;">
                    <option value="3" selected="selected">3월</option>
                    <option value="4">4월</option>
                    <option value="5">5월</option>
                    <option value="6">6월</option>
                    <option value="7">7월</option>
                    <option value="8">8월</option>
                    <option value="9">9월</option>
                    <option value="10">10월</option>
                    <option value="11">11월</option>
                    <option value="12">12월</option>
                    <option value="1">1월</option>
                    <option value="2">2월</option>
                  </select>
                  <div class="error_msg"></div>
                </td>
              </tr>
              <tr>
                <th colspan="2" style="background:#f8fafc; border:1px solid #ddd; padding:8px 12px; text-align:left; font-weight:bold; font-size:12px;">월 최대<br>지원 금액 <span><i class="fa fa-check-square-o" style="color:#2563eb;"></i></span></th>
                <td style="border:1px solid #ddd; padding:8px 12px;">
                  <input id="max_support_pay" name="max_support_pay" type="text" title="월 최대 지원금액" size="11" value="0" class="form-control size40 text-right" maxlength="9" style="width:100px; height:28px; background:yellow; font-weight:bold; text-align:right; border:1px solid #ccc; border-radius:3px; padding:0 6px;" onkeyup="chkMoney(this);" onblur="chkMoney(this);">원 (강좌 합산)
                  <br><span style="font-size:11px; color:#666;">('0'원인 경우 제한 없이 지원됩니다.)</span>
                  <br><span style="font-size:11px; color:#666;">※ 자동으로 지원금을 계산하는 경우에만 조건으로 사용됩니다.</span>
                  <div class="error_msg"></div>
                </td>
              </tr>
              <tr>
                <th colspan="2" style="background:#f8fafc; border:1px solid #ddd; padding:8px 12px; text-align:left; font-weight:bold; font-size:12px;">이름 <span><i class="fa fa-check-square-o" style="color:#2563eb;"></i></span></th>
                <td style="border:1px solid #ddd; padding:8px 12px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span id="app_mem_name" style="font-weight:bold; font-size:13px; color:#1e293b;"></span>
                    <span id="sub_app_reg_student_name_label" style="display:none;"></span>
                    <span class="mobile_clear MAT10">
                      <button type="button" onclick="openSubsidyAppSearchStudentModal();" class="btn btn-success btn-sm" style="color:#FFFFFF; height:28px; padding:0 12px; display:inline-flex; align-items:center; gap:4px; font-size:12px; font-weight:bold; border-radius:3px; background-color:#5cb85c; border-color:#4cae4c; cursor:pointer;"><i class="fa fa-binoculars"></i> 신청자 검색</button>
                    </span>
                  </div>
                  <div class="error_msg error_app_num"></div>
                </td>
              </tr>
              <tr>
                <th colspan="2" style="background:#f8fafc; border:1px solid #ddd; padding:8px 12px; text-align:left; font-weight:bold; font-size:12px;">학년</th>
                <td style="border:1px solid #ddd; padding:8px 12px; font-size:12px;"><span id="app_mem_grade"></span><span id="sub_app_reg_grade_label" style="display:none;"></span>학년</td>
              </tr>
              <tr>
                <th colspan="2" style="background:#f8fafc; border:1px solid #ddd; padding:8px 12px; text-align:left; font-weight:bold; font-size:12px;">반</th>
                <td style="border:1px solid #ddd; padding:8px 12px; font-size:12px;"><span id="app_mem_class"></span><span id="sub_app_reg_class_label" style="display:none;"></span>반</td>
              </tr>
              <tr>
                <th colspan="2" style="background:#f8fafc; border:1px solid #ddd; padding:8px 12px; text-align:left; font-weight:bold; font-size:12px;">번호</th>
                <td style="border:1px solid #ddd; padding:8px 12px; font-size:12px;"><span id="app_mem_bunho"></span><span id="sub_app_reg_num_label" style="display:none;"></span>번</td>
              </tr>
              <!-- 신청정보 섹션 -->
              <tr>
                <th rowspan="7" width="70" style="min-width:70px; background:#f8fafc; border:1px solid #ddd; padding:8px 6px; text-align:center; font-weight:bold; font-size:12px; vertical-align:middle;">신청정보</th>
                <th width="120" style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-weight:bold; font-size:12px;">강좌명</th>
                <td style="border:1px solid #ddd; padding:8px 12px; font-size:12px; font-weight:bold; color:#1e293b;">
                  <span id="lec_name"></span>
                  <span id="sub_app_reg_course_label" style="display:none;"></span>
                </td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">수강료</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="app_lec_pay" id="app_lec_pay" title="수강료" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px; background:#f5f5f5;" readonly="" class="form-control text-right">원 (강사료 + 수용비)<div class="error_msg error_app_lec_pay"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">강사료</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="app_lec_tea_fee" id="app_lec_tea_fee" title="강사료" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px; background:#f5f5f5;" readonly="" class="form-control text-right">원<div class="error_msg error_app_lec_tea_fee"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">수용비</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="app_lec_use_cost" id="app_lec_use_cost" title="수용비" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px; background:#f5f5f5;" readonly="" class="form-control text-right">원<div class="error_msg error_app_lec_use_cost"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">교재비</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="app_lec_pay_book" id="app_lec_pay_book" title="교재비" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px; background:#f5f5f5;" readonly="" class="form-control text-right">원<div class="error_msg error_app_lec_pay_book"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">재료비</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="app_lec_pay_item" id="app_lec_pay_item" title="재료비" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px; background:#f5f5f5;" readonly="" class="form-control text-right">원<div class="error_msg error_app_lec_pay_item"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-weight:bold; font-size:12px;">비용 합계</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="tot_app_lec_pay" id="tot_app_lec_pay" title="비용 합계" value="0" size="10" maxlength="9" style="width:80px; height:28px; background:yellow; font-weight:bold; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px;" readonly="" class="form-control text-right">원<div class="error_msg error_tot_app_lec_pay"></div></td>
              </tr>
              <!-- 1학년 지원금 -->
              <tr style="border-top:2px solid #B5B5B5 !important;">
                <th rowspan="6" width="90" style="min-width:70px; background:#f8fafc; border:1px solid #ddd; padding:8px 6px; text-align:center; font-weight:bold; font-size:12px; vertical-align:middle;">1학년 지원금</th>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">수강료</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="free2_lec_pay" id="free2_lec_pay" title="1학년 지원금 수강료" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px; background:#f5f5f5;" class="form-control text-right free_pay" readonly="readonly" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">원 (강사료 + 수용비)<div class="error_msg error_free2_lec_pay"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">강사료</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="free2_lec_tea_fee" id="free2_lec_tea_fee" title="1학년 지원금 강사료" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">원<div class="error_msg error_free2_lec_tea_fee"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">수용비</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="free2_lec_use_cost" id="free2_lec_use_cost" title="1학년 지원금 수용비" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">원<div class="error_msg error_free2_lec_use_cost"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">교재비</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="free2_lec_pay_book" id="free2_lec_pay_book" title="1학년 지원금 교재비" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">원<div class="error_msg error_free2_lec_pay_book"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">재료비</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="free2_lec_pay_item" id="free2_lec_pay_item" title="1학년 지원금 재료비" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">원<div class="error_msg error_free2_lec_pay_item"></div></td>
              </tr>
              <tr>
                <th style="font-weight:bold; background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">지원금액 합계</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="free2_deduct_pay" id="free2_deduct_pay" title="1학년 지원금 지원금액 합계" value="0" size="10" maxlength="9" style="width:80px; height:28px; background:yellow; font-weight:bold; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px;" readonly="" class="form-control text-right free_pay">원<div class="error_msg error_free2_deduct_pay"></div></td>
              </tr>
              <!-- 3학년 지원금 -->
              <tr style="border-top:2px solid #B5B5B5 !important;">
                <th rowspan="6" width="90" style="min-width:70px; background:#f8fafc; border:1px solid #ddd; padding:8px 6px; text-align:center; font-weight:bold; font-size:12px; vertical-align:middle;">3학년 지원금</th>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">수강료</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="free3_lec_pay" id="free3_lec_pay" title="3학년 지원금 수강료" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px; background:#f5f5f5;" class="form-control text-right free_pay" readonly="readonly" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">원 (강사료 + 수용비)<div class="error_msg error_free3_lec_pay"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">강사료</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="free3_lec_tea_fee" id="free3_lec_tea_fee" title="3학년 지원금 강사료" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">원<div class="error_msg error_free3_lec_tea_fee"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">수용비</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="free3_lec_use_cost" id="free3_lec_use_cost" title="3학년 지원금 수용비" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">원<div class="error_msg error_free3_lec_use_cost"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">교재비</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="free3_lec_pay_book" id="free3_lec_pay_book" title="3학년 지원금 교재비" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">원<div class="error_msg error_free3_lec_pay_book"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">재료비</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="free3_lec_pay_item" id="free3_lec_pay_item" title="3학년 지원금 재료비" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">원<div class="error_msg error_free3_lec_pay_item"></div></td>
              </tr>
              <tr>
                <th style="font-weight:bold; background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">지원금액 합계</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="free3_deduct_pay" id="free3_deduct_pay" title="3학년 지원금 지원금액 합계" value="0" size="10" maxlength="9" style="width:80px; height:28px; background:yellow; font-weight:bold; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px;" readonly="" class="form-control text-right free_pay">원<div class="error_msg error_free3_deduct_pay"></div></td>
              </tr>
              <!-- 자유수강권 -->
              <tr style="border-top:2px solid #B5B5B5 !important;">
                <th rowspan="6" width="90" style="min-width:70px; background:#f8fafc; border:1px solid #ddd; padding:8px 6px; text-align:center; font-weight:bold; font-size:12px; vertical-align:middle;">자유수강권</th>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">수강료</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="free1_lec_pay" id="free1_lec_pay" title="자유수강권 수강료" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px; background:#f5f5f5;" class="form-control text-right free_pay" readonly="readonly" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">원 (강사료 + 수용비)<div class="error_msg error_free1_lec_pay"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">강사료</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="free1_lec_tea_fee" id="free1_lec_tea_fee" title="자유수강권 강사료" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">원<div class="error_msg error_free1_lec_tea_fee"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">수용비</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="free1_lec_use_cost" id="free1_lec_use_cost" title="자유수강권 수용비" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">원<div class="error_msg error_free1_lec_use_cost"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">교재비</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="free1_lec_pay_book" id="free1_lec_pay_book" title="자유수강권 교재비" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">원<div class="error_msg error_free1_lec_pay_book"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">재료비</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="free1_lec_pay_item" id="free1_lec_pay_item" title="자유수강권 재료비" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">원<div class="error_msg error_free1_lec_pay_item"></div></td>
              </tr>
              <tr>
                <th style="font-weight:bold; background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">지원금액 합계</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="free1_deduct_pay" id="free1_deduct_pay" title="자유수강권 지원금액 합계" value="0" size="10" maxlength="9" style="width:80px; height:28px; background:yellow; font-weight:bold; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px;" readonly="" class="form-control text-right free_pay">원<div class="error_msg error_free1_deduct_pay"></div></td>
              </tr>
              <!-- 지원금액 전체 합계 -->
              <tr style="border-top:2px solid #B5B5B5 !important;">
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 12px; text-align:left; font-weight:bold; font-size:12px;" colspan="2">지원금액 전체 합계</th>
                <td style="border:1px solid #ddd; padding:8px 12px; font-weight:bold;">
                  <input name="free_deduct_pay" id="free_deduct_pay" title="지원금액 전체 합계" value="0" size="10" maxlength="9" style="width:80px; height:28px; background:yellow; font-weight:bold; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px;" readonly="" class="form-control text-right">원
                  <div class="error_msg error_free_deduct_pay"></div>
                </td>
              </tr>
              <!-- 징수금액 섹션 -->
              <tr style="border-top:2px solid #B5B5B5 !important;">
                <th rowspan="6" width="70" style="min-width:70px; background:#f8fafc; border:1px solid #ddd; padding:8px 6px; text-align:center; font-weight:bold; font-size:12px; vertical-align:middle;">징수금액</th>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">수강료</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="co_amount_lec_pay" id="co_amount_lec_pay" title="수강료" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px; background:#f5f5f5;" readonly="" class="form-control text-right">원 (강사료 + 수용비)<div class="error_msg error_co_amount_lec_pay"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">강사료</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="co_amount_lec_tea_fee" id="co_amount_lec_tea_fee" title="강사료" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px; background:#f5f5f5;" readonly="" class="form-control text-right">원<div class="error_msg error_co_amount_lec_tea_fee"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">수용비</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="co_amount_lec_use_cost" id="co_amount_lec_use_cost" title="수용비" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px; background:#f5f5f5;" readonly="" class="form-control text-right">원<div class="error_msg error_co_amount_lec_use_cost"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">교재비</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="co_amount_lec_pay_book" id="co_amount_lec_pay_book" title="교재비" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px; background:#f5f5f5;" readonly="" class="form-control text-right">원<div class="error_msg error_co_amount_lec_pay_book"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-size:12px;">재료비</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="co_amount_lec_pay_item" id="co_amount_lec_pay_item" title="재료비" value="0" size="10" maxlength="9" style="width:80px; height:28px; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px; background:#f5f5f5;" readonly="" class="form-control text-right">원<div class="error_msg error_co_amount_lec_pay_item"></div></td>
              </tr>
              <tr>
                <th style="background:#f8fafc; border:1px solid #ddd; padding:8px 10px; text-align:left; font-weight:bold; font-size:12px;">징수금액 합계</th>
                <td style="border:1px solid #ddd; padding:8px 12px;"><input name="co_amount_pay" id="co_amount_pay" title="징수금액 합계" value="0" size="10" maxlength="9" style="width:80px; height:28px; background:yellow; font-weight:bold; text-align:right; padding:0 6px; border:1px solid #ccc; border-radius:3px;" class="form-control text-right" onkeyup="chkMoney(this);">원<div class="error_msg error_co_amount_pay"></div></td>
              </tr>
              <!-- 비고 -->
              <tr>
                <th colspan="2" style="background:#f8fafc; border:1px solid #ddd; padding:8px 12px; text-align:left; font-weight:bold; font-size:12px;">비고</th>
                <td style="border:1px solid #ddd; padding:8px 12px;">
                  <textarea name="bigo" id="bigo" class="form-control" rows="5" maxlength="100" style="width:90%; font-size:12px; border:1px solid #ccc; border-radius:3px; padding:6px; resize:vertical;"></textarea>
                </td>
              </tr>
              <!-- 지원금 계산 로그 -->
              <tr>
                <th colspan="2" style="background:#f8fafc; border:1px solid #ddd; padding:8px 12px; text-align:left; font-weight:bold; font-size:12px;">지원금 계산 로그</th>
                <td style="border:1px solid #ddd; padding:8px 12px;">
                  <textarea name="log_data" id="log_data" class="form-control" rows="10" maxlength="500" style="width:90%; font-size:11px; color:#666; background:#f8fafc; border:1px solid #ddd; border-radius:3px; padding:6px; resize:vertical;" readonly="readonly"></textarea>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="text-center MAT30" style="display:flex; justify-content:center; gap:10px; margin-top:20px; margin-bottom:15px;">
            <button type="button" onclick="closeSubsidyAppRegisterModal();" class="btn btn-default" style="height:30px; padding:0 18px; font-size:12px; border:1px solid #ccc; background:#fff; color:#333; border-radius:3px; cursor:pointer;">취소</button>
            <button type="submit" data-loading-text="처리중 .." class="btn btn-primary" style="height:30px; padding:0 22px; font-size:12px; font-weight:bold; background-color:#337ab7; border-color:#2e6da4; color:#fff; border-radius:3px; cursor:pointer;">등록</button>
          </p>
        </form>
        <div class="help_box" style="margin-top:14px; padding:10px 14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:4px; font-size:12px; color:#555;">
          <ul style="margin:0; padding-left:18px; line-height:1.8;">
            <li>대상 월 : 수강자를 저장할 월</li>
            <li>신청자 정보 : 강좌에 신청된 학생을 검색하여 등록할 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>'''

def process_file(filepath):
    print("Processing:", filepath)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find start and end of modal 37
    start_marker = '<!-- ==================== 37. 수강자등록 모달'
    end_marker = '<!-- ==================== 38. 신청자 검색 팝업 모달'

    s_idx = content.find(start_marker)
    if s_idx == -1:
        print("Start marker not found in", filepath)
        return False
    e_idx = content.find(end_marker, s_idx)
    if e_idx == -1:
        print("End marker not found in", filepath)
        return False

    new_content = content[:s_idx] + modal_html + '\n\n  ' + content[e_idx:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Updated:", filepath)
    return True

base_dir = r"c:\Users\user\My project\course\course_site\course_site\af\ad_lec\lists\sn"
f1 = os.path.join(base_dir, "index.html")
f2 = os.path.join(base_dir, "3267", "index.html")

process_file(f1)
process_file(f2)
print("Done!")
