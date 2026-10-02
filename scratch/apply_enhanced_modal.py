# -*- coding: utf-8 -*-
import re

new_reg_modal = '''<!-- ==================== 37. 수강자등록 모달 (로컬 모달 스타일 및 가독성 극대화 매트릭스 그리드) ==================== -->
  <div id="modal_sub_app_register" class="modal" style="display:none; position:fixed !important; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); z-index:99999 !important; align-items:center; justify-content:center;">
    <div class="modal-box" style="margin:auto !important; position:relative !important; background:#ffffff; border-radius:6px; width:95%; max-width:960px; max-height:92vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 12px 36px rgba(0,0,0,0.28); border:1px solid #cbd5e1;">
      <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 20px; background:#337ab7; border-radius:5px 5px 0 0; color:#fff;">
        <h4 style="margin:0; font-size:16px; font-weight:bold; color:#fff; display:flex; align-items:center; gap:8px;">
          <i class="fa fa-user-plus"></i> 수강자 등록
        </h4>
        <button type="button" onclick="closeSubsidyAppRegisterModal();" style="border:none; background:transparent; font-size:22px; cursor:pointer; color:#ffffff; opacity:0.85; line-height:1;">&times;</button>
      </div>

      <div style="padding:18px 22px; overflow-y:auto; flex:1; background:#ffffff;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; font-size:12px; color:#64748b;">
          <span><i class="fa fa-check-square-o" style="color:#2563eb; font-weight:bold;"></i> 표시가 있는 항목은 반드시 입력해야 합니다.</span>
          <span style="font-size:11px; color:#64748b;"><i class="fa fa-info-circle" style="color:#3b82f6;"></i> 신청자 검색 후 지원금을 입력하면 합계와 징수금액이 실시간 자동 계산됩니다.</span>
        </div>

        <form name="fm_edit" id="fm_edit" onsubmit="event.preventDefault(); return fm_edit_check(this);" method="post" accept-charset="utf-8">
          <input type="hidden" name="app_num" id="app_num" value="">
          <input type="hidden" id="sub_app_reg_applicant_id" value="">

          <!-- 상단 2열 기본 정보 & 수강생 요약 카드 -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:12px 16px; margin-bottom:14px; display:grid; grid-template-columns:1fr 1.3fr; gap:16px; align-items:center;">
            <!-- 좌측: 대상 월 및 최대 지원금액 -->
            <div style="display:flex; flex-direction:column; gap:8px; border-right:1px solid #e2e8f0; padding-right:16px;">
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-weight:bold; font-size:12px; color:#334155; min-width:85px;">
                  대상 월 <i class="fa fa-check-square-o" style="color:#2563eb;"></i>
                </span>
                <select name="month" id="month" class="form-control" style="width:110px; height:30px; line-height:normal !important; box-sizing:border-box !important; vertical-align:middle; padding:0 24px 0 10px; border:1px solid #cbd5e1; border-radius:3px; font-size:12px;">
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
                <div class="error_msg" style="display:none;"></div>
              </div>
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-weight:bold; font-size:12px; color:#334155; min-width:85px;">
                  월 최대 지원금 <i class="fa fa-check-square-o" style="color:#2563eb;"></i>
                </span>
                <div style="display:flex; align-items:center; gap:4px;">
                  <input id="max_support_pay" name="max_support_pay" type="text" title="월 최대 지원금액" size="11" value="0" class="form-control size40 text-right" maxlength="9" style="width:90px; height:28px; background:#fef9c3; font-weight:bold; text-align:right; border:1px solid #cbd5e1; border-radius:3px; padding:0 6px; font-size:12px;" onkeyup="chkMoney(this);" onblur="chkMoney(this);">
                  <span style="font-size:12px;">원</span>
                </div>
                <span style="font-size:11px; color:#94a3b8;">(0원: 무제한)</span>
                <div class="error_msg" style="display:none;"></div>
              </div>
            </div>

            <!-- 우측: 수강 학생 및 강좌 정보 -->
            <div style="display:flex; flex-direction:column; gap:6px;">
              <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:6px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-weight:bold; font-size:12px; color:#334155;">학생:</span>
                  <span id="app_mem_name" style="font-weight:bold; font-size:15px; color:#1e293b; background:#e0f2fe; padding:2px 10px; border-radius:4px; min-width:60px; text-align:center; display:inline-block;">선택대기</span>
                  <span id="sub_app_reg_student_name_label" style="display:none;"></span>
                </div>
                <button type="button" onclick="openSubsidyAppSearchStudentModal();" class="btn btn-success btn-sm" style="color:#FFFFFF; height:28px; padding:0 12px; display:inline-flex; align-items:center; gap:4px; font-size:12px; font-weight:bold; border-radius:3px; background-color:#5cb85c; border-color:#4cae4c; cursor:pointer;">
                  <i class="fa fa-binoculars"></i> 신청자 검색
                </button>
              </div>
              <div style="display:flex; align-items:center; gap:8px; font-size:12px;">
                <span style="font-weight:bold; color:#64748b;">학적:</span>
                <span style="background:#f1f5f9; padding:2px 8px; border-radius:3px; font-size:12px; font-weight:bold; color:#334155; border:1px solid #e2e8f0;">
                  <span id="app_mem_grade">-</span><span id="sub_app_reg_grade_label" style="display:none;"></span>학년
                </span>
                <span style="background:#f1f5f9; padding:2px 8px; border-radius:3px; font-size:12px; font-weight:bold; color:#334155; border:1px solid #e2e8f0;">
                  <span id="app_mem_class">-</span><span id="sub_app_reg_class_label" style="display:none;"></span>반
                </span>
                <span style="background:#f1f5f9; padding:2px 8px; border-radius:3px; font-size:12px; font-weight:bold; color:#334155; border:1px solid #e2e8f0;">
                  <span id="app_mem_bunho">-</span><span id="sub_app_reg_num_label" style="display:none;"></span>번
                </span>
              </div>
              <div style="font-size:12px; display:flex; align-items:center; gap:6px;">
                <span style="font-weight:bold; color:#64748b;">강좌:</span>
                <span id="lec_name" style="font-weight:bold; color:#2563eb; font-size:13px;">-</span>
                <span id="sub_app_reg_course_label" style="display:none;"></span>
              </div>
            </div>
          </div>

          <!-- 비용 및 지원금 실시간 정밀 비교 매트릭스 그리드 (한눈에 5열 비교) -->
          <div class="table-responsive" style="overflow-x:auto;">
            <table class="table table-bordered list MAT0 db-table" style="width:100%; border-collapse:collapse; margin-bottom:10px; text-align:center; font-size:12px;">
              <colgroup>
                <col style="width: 140px;">
                <col style="width: 17%;">
                <col style="width: 17%;">
                <col style="width: 17%;">
                <col style="width: 17%;">
                <col style="width: 18%;">
              </colgroup>
              <thead>
                <tr style="background:#f1f5f9; border-top:2px solid #337ab7;">
                  <th style="background:#f1f5f9; vertical-align:middle; font-weight:bold; padding:9px 6px; border:1px solid #cbd5e1;">항목 구분</th>
                  <th style="background:#f8fafc; vertical-align:middle; font-weight:bold; padding:9px 6px; color:#1e293b; border:1px solid #cbd5e1;">신청비용 (A)</th>
                  <th style="background:#eff6ff; vertical-align:middle; font-weight:bold; padding:9px 6px; color:#1d4ed8; border:1px solid #cbd5e1;">1학년 지원금 (B1)</th>
                  <th style="background:#f0fdf4; vertical-align:middle; font-weight:bold; padding:9px 6px; color:#15803d; border:1px solid #cbd5e1;">3학년 지원금 (B2)</th>
                  <th style="background:#faf5ff; vertical-align:middle; font-weight:bold; padding:9px 6px; color:#7e22ce; border:1px solid #cbd5e1;">자유수강권 (B3)</th>
                  <th style="background:#fff7ed; vertical-align:middle; font-weight:bold; padding:9px 6px; color:#c2410c; border:1px solid #cbd5e1;">징수금액 (A - ΣB)</th>
                </tr>
              </thead>
              <tbody>
                <!-- 1. 수강료 -->
                <tr>
                  <th style="background:#f8fafc; border:1px solid #ddd; padding:7px 8px; font-weight:bold; text-align:left;">
                    수강료 <span style="font-size:11px; font-weight:normal; color:#64748b;">(강사+수용)</span>
                  </th>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#f8fafc;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="app_lec_pay" id="app_lec_pay" title="수강료" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #cbd5e1; border-radius:3px; background:#f1f5f9;" readonly="" class="form-control text-right">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_app_lec_pay" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#eff6ff;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="free2_lec_pay" id="free2_lec_pay" title="1학년 지원금 수강료" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #cbd5e1; border-radius:3px; background:#f1f5f9;" class="form-control text-right free_pay" readonly="readonly" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_free2_lec_pay" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#f0fdf4;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="free3_lec_pay" id="free3_lec_pay" title="3학년 지원금 수강료" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #cbd5e1; border-radius:3px; background:#f1f5f9;" class="form-control text-right free_pay" readonly="readonly" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_free3_lec_pay" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#faf5ff;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="free1_lec_pay" id="free1_lec_pay" title="자유수강권 수강료" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #cbd5e1; border-radius:3px; background:#f1f5f9;" class="form-control text-right free_pay" readonly="readonly" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_free1_lec_pay" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#fff7ed;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="co_amount_lec_pay" id="co_amount_lec_pay" title="수강료" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #fed7aa; border-radius:3px; background:#f1f5f9; font-weight:bold;" readonly="" class="form-control text-right">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_co_amount_lec_pay" style="display:none;"></div>
                  </td>
                </tr>

                <!-- 2. 강사료 -->
                <tr>
                  <th style="background:#f8fafc; border:1px solid #ddd; padding:7px 8px; font-weight:bold; text-align:left;">강사료</th>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#f8fafc;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="app_lec_tea_fee" id="app_lec_tea_fee" title="강사료" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #cbd5e1; border-radius:3px; background:#f1f5f9;" readonly="" class="form-control text-right">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_app_lec_tea_fee" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#eff6ff;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="free2_lec_tea_fee" id="free2_lec_tea_fee" title="1학년 지원금 강사료" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #93c5fd; border-radius:3px; background:#ffffff;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_free2_lec_tea_fee" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#f0fdf4;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="free3_lec_tea_fee" id="free3_lec_tea_fee" title="3학년 지원금 강사료" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #86efac; border-radius:3px; background:#ffffff;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_free3_lec_tea_fee" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#faf5ff;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="free1_lec_tea_fee" id="free1_lec_tea_fee" title="자유수강권 강사료" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #d8b4fe; border-radius:3px; background:#ffffff;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_free1_lec_tea_fee" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#fff7ed;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="co_amount_lec_tea_fee" id="co_amount_lec_tea_fee" title="강사료" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #fed7aa; border-radius:3px; background:#f1f5f9; font-weight:bold;" readonly="" class="form-control text-right">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_co_amount_lec_tea_fee" style="display:none;"></div>
                  </td>
                </tr>

                <!-- 3. 수용비 -->
                <tr>
                  <th style="background:#f8fafc; border:1px solid #ddd; padding:7px 8px; font-weight:bold; text-align:left;">수용비</th>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#f8fafc;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="app_lec_use_cost" id="app_lec_use_cost" title="수용비" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #cbd5e1; border-radius:3px; background:#f1f5f9;" readonly="" class="form-control text-right">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_app_lec_use_cost" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#eff6ff;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="free2_lec_use_cost" id="free2_lec_use_cost" title="1학년 지원금 수용비" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #93c5fd; border-radius:3px; background:#ffffff;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_free2_lec_use_cost" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#f0fdf4;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="free3_lec_use_cost" id="free3_lec_use_cost" title="3학년 지원금 수용비" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #86efac; border-radius:3px; background:#ffffff;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_free3_lec_use_cost" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#faf5ff;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="free1_lec_use_cost" id="free1_lec_use_cost" title="자유수강권 수용비" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #d8b4fe; border-radius:3px; background:#ffffff;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_free1_lec_use_cost" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#fff7ed;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="co_amount_lec_use_cost" id="co_amount_lec_use_cost" title="수용비" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #fed7aa; border-radius:3px; background:#f1f5f9; font-weight:bold;" readonly="" class="form-control text-right">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_co_amount_lec_use_cost" style="display:none;"></div>
                  </td>
                </tr>

                <!-- 4. 교재비 -->
                <tr>
                  <th style="background:#f8fafc; border:1px solid #ddd; padding:7px 8px; font-weight:bold; text-align:left;">교재비</th>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#f8fafc;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="app_lec_pay_book" id="app_lec_pay_book" title="교재비" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #cbd5e1; border-radius:3px; background:#f1f5f9;" readonly="" class="form-control text-right">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_app_lec_pay_book" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#eff6ff;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="free2_lec_pay_book" id="free2_lec_pay_book" title="1학년 지원금 교재비" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #93c5fd; border-radius:3px; background:#ffffff;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_free2_lec_pay_book" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#f0fdf4;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="free3_lec_pay_book" id="free3_lec_pay_book" title="3학년 지원금 교재비" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #86efac; border-radius:3px; background:#ffffff;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_free3_lec_pay_book" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#faf5ff;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="free1_lec_pay_book" id="free1_lec_pay_book" title="자유수강권 교재비" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #d8b4fe; border-radius:3px; background:#ffffff;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_free1_lec_pay_book" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#fff7ed;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="co_amount_lec_pay_book" id="co_amount_lec_pay_book" title="교재비" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #fed7aa; border-radius:3px; background:#f1f5f9; font-weight:bold;" readonly="" class="form-control text-right">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_co_amount_lec_pay_book" style="display:none;"></div>
                  </td>
                </tr>

                <!-- 5. 재료비 -->
                <tr>
                  <th style="background:#f8fafc; border:1px solid #ddd; padding:7px 8px; font-weight:bold; text-align:left;">재료비</th>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#f8fafc;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="app_lec_pay_item" id="app_lec_pay_item" title="재료비" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #cbd5e1; border-radius:3px; background:#f1f5f9;" readonly="" class="form-control text-right">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_app_lec_pay_item" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#eff6ff;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="free2_lec_pay_item" id="free2_lec_pay_item" title="1학년 지원금 재료비" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #93c5fd; border-radius:3px; background:#ffffff;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_free2_lec_pay_item" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#f0fdf4;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="free3_lec_pay_item" id="free3_lec_pay_item" title="3학년 지원금 재료비" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #86efac; border-radius:3px; background:#ffffff;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_free3_lec_pay_item" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#faf5ff;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="free1_lec_pay_item" id="free1_lec_pay_item" title="자유수강권 재료비" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #d8b4fe; border-radius:3px; background:#ffffff;" class="form-control text-right free_pay" onkeyup="chkMoney(this);" onblur="chkFreeMoney(this);">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_free1_lec_pay_item" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #ddd; padding:6px 8px; background:#fff7ed;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="co_amount_lec_pay_item" id="co_amount_lec_pay_item" title="재료비" value="0" size="10" maxlength="9" style="width:80px; height:26px; text-align:right; padding:0 6px; border:1px solid #fed7aa; border-radius:3px; background:#f1f5f9; font-weight:bold;" readonly="" class="form-control text-right">
                      <span>원</span>
                    </div>
                    <div class="error_msg error_co_amount_lec_pay_item" style="display:none;"></div>
                  </td>
                </tr>

                <!-- 6. 합계 강조 행 -->
                <tr style="background:#fefce8; border-top:2px solid #ca8a04;">
                  <th style="background:#fef9c3; border:1px solid #cbd5e1; padding:8px 8px; font-weight:bold; text-align:left; color:#854d0e;">
                    <i class="fa fa-calculator" style="margin-right:2px;"></i> 비용 합계
                  </th>
                  <td style="border:1px solid #cbd5e1; padding:6px 8px; background:#fef9c3;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="tot_app_lec_pay" id="tot_app_lec_pay" title="비용 합계" value="0" size="10" maxlength="9" style="width:80px; height:26px; background:#fef08a; font-weight:bold; color:#1e293b; text-align:right; padding:0 6px; border:1px solid #cbd5e1; border-radius:3px;" readonly="" class="form-control text-right">
                      <span style="font-weight:bold;">원</span>
                    </div>
                    <div class="error_msg error_tot_app_lec_pay" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #cbd5e1; padding:6px 8px; background:#eff6ff;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="free2_deduct_pay" id="free2_deduct_pay" title="1학년 지원금 지원금액 합계" value="0" size="10" maxlength="9" style="width:80px; height:26px; background:#dbeafe; font-weight:bold; color:#1d4ed8; text-align:right; padding:0 6px; border:1px solid #93c5fd; border-radius:3px;" readonly="" class="form-control text-right free_pay">
                      <span style="font-weight:bold; color:#1d4ed8;">원</span>
                    </div>
                    <div class="error_msg error_free2_deduct_pay" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #cbd5e1; padding:6px 8px; background:#f0fdf4;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="free3_deduct_pay" id="free3_deduct_pay" title="3학년 지원금 지원금액 합계" value="0" size="10" maxlength="9" style="width:80px; height:26px; background:#dcfce7; font-weight:bold; color:#15803d; text-align:right; padding:0 6px; border:1px solid #86efac; border-radius:3px;" readonly="" class="form-control text-right free_pay">
                      <span style="font-weight:bold; color:#15803d;">원</span>
                    </div>
                    <div class="error_msg error_free3_deduct_pay" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #cbd5e1; padding:6px 8px; background:#faf5ff;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="free1_deduct_pay" id="free1_deduct_pay" title="자유수강권 지원금액 합계" value="0" size="10" maxlength="9" style="width:80px; height:26px; background:#f3e8ff; font-weight:bold; color:#7e22ce; text-align:right; padding:0 6px; border:1px solid #d8b4fe; border-radius:3px;" readonly="" class="form-control text-right free_pay">
                      <span style="font-weight:bold; color:#7e22ce;">원</span>
                    </div>
                    <div class="error_msg error_free1_deduct_pay" style="display:none;"></div>
                  </td>
                  <td style="border:1px solid #cbd5e1; padding:6px 8px; background:#ffedd5;">
                    <div style="display:flex; align-items:center; justify-content:center; gap:3px;">
                      <input name="co_amount_pay" id="co_amount_pay" title="징수금액 합계" value="0" size="10" maxlength="9" style="width:80px; height:26px; background:#fed7aa; font-weight:bold; color:#c2410c; text-align:right; padding:0 6px; border:1px solid #f97316; border-radius:3px;" class="form-control text-right" onkeyup="chkMoney(this);">
                      <span style="font-weight:bold; color:#c2410c;">원</span>
                    </div>
                    <div class="error_msg error_co_amount_pay" style="display:none;"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 실시간 총 지원금 요약 배너 -->
          <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:4px; padding:10px 16px; display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
            <span style="font-weight:bold; font-size:13px; color:#0369a1; display:inline-flex; align-items:center; gap:6px;">
              <i class="fa fa-calculator" style="font-size:14px;"></i> 총 지원금 차감 합계 (1학년 + 3학년 + 자유수강권)
            </span>
            <div style="display:inline-flex; align-items:center; gap:6px; font-weight:bold; font-size:13px;">
              <input name="free_deduct_pay" id="free_deduct_pay" title="지원금액 전체 합계" value="0" size="10" maxlength="9" style="width:105px; height:28px; background:#fef9c3; font-weight:bold; text-align:right; padding:0 8px; border:1px solid #cbd5e1; border-radius:3px; color:#0369a1;" readonly="" class="form-control text-right">
              <span>원</span>
            </div>
            <div class="error_msg error_free_deduct_pay" style="display:none;"></div>
          </div>

          <!-- 비고 및 지원금 계산 로그 (2열 나란히 배치) -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px;">
            <div>
              <label style="font-size:12px; font-weight:bold; color:#334155; margin-bottom:4px; display:block;">비고</label>
              <textarea name="bigo" id="bigo" class="form-control" rows="3" maxlength="100" placeholder="특이사항 및 메모 입력" style="width:100%; font-size:12px; border:1px solid #cbd5e1; border-radius:4px; padding:8px; resize:vertical; box-sizing:border-box;"></textarea>
            </div>
            <div>
              <label style="font-size:12px; font-weight:bold; color:#334155; margin-bottom:4px; display:block;">지원금 계산 로그</label>
              <textarea name="log_data" id="log_data" class="form-control" rows="3" maxlength="500" placeholder="자동 생성되는 지원금 계산 상세 로그입니다." style="width:100%; font-size:11px; color:#64748b; background:#f8fafc; border:1px solid #e2e8f0; border-radius:4px; padding:8px; resize:vertical; box-sizing:border-box;" readonly="readonly"></textarea>
            </div>
          </div>

          <!-- 하단 액션 버튼 -->
          <div style="display:flex; justify-content:center; gap:10px; margin-top:14px; margin-bottom:14px;">
            <button type="button" onclick="closeSubsidyAppRegisterModal();" class="btn btn-default" style="height:32px; padding:0 22px; font-size:13px; border:1px solid #cbd5e1; background:#ffffff; color:#334155; border-radius:4px; cursor:pointer;">취소</button>
            <button type="submit" data-loading-text="처리중 .." class="btn btn-primary" style="height:32px; padding:0 26px; font-size:13px; font-weight:bold; background-color:#337ab7; border-color:#2e6da4; color:#fff; border-radius:4px; cursor:pointer;">등록</button>
          </div>
        </form>

        <!-- 도움말 가이드 박스 -->
        <div class="help_box" style="padding:10px 14px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:4px; font-size:12px; color:#1e40af;">
          <ul style="margin:0; padding-left:18px; line-height:1.7;">
            <li><strong>대상 월</strong>: 수강자를 저장할 월을 선택합니다.</li>
            <li><strong>신청자 정보</strong>: [신청자 검색] 버튼을 눌러 학생을 선택하면 수강료 및 지원금이 자동 채워집니다.</li>
            <li><strong>지원금 입력</strong>: 1학년/3학년/자유수강권의 지원 항목을 입력하면 총 지원금 및 실 징수금액이 실시간 자동 집계됩니다.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>'''

# 신청자 검색 모달 헤더 로컬 스타일 통일
new_search_header = '''<!-- ==================== 38. 신청자 검색 팝업 모달 (공식 서식 BIN0004 1:1) ==================== -->
  <div id="modal_sub_app_search_student" class="modal" style="display:none; position:fixed !important; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.6); z-index:100000 !important; align-items:center; justify-content:center;">
    <div class="modal-box" style="margin:auto !important; position:relative !important; background:#ffffff; border-radius:6px; width:92%; max-width:760px; max-height:88vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 12px 36px rgba(0,0,0,0.3); border:1px solid #cbd5e1;">
      <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 20px; background:#337ab7; border-radius:5px 5px 0 0; color:#fff;">
        <h4 style="margin:0; font-size:16px; font-weight:bold; color:#fff; display:flex; align-items:center; gap:8px;">
          <i class="fa fa-binoculars"></i> 신청자 검색
        </h4>
        <button type="button" onclick="closeSubsidyAppSearchStudentModal();" style="border:none; background:transparent; font-size:22px; cursor:pointer; color:#ffffff; opacity:0.85; line-height:1;">&times;</button>
      </div>'''

# 수강자 가져오기 모달 헤더 로컬 스타일 통일
new_import_header = '''<!-- ==================== 39. 수강자 가져오기 모달 (공식 서식 BIN000E & 늘봄과정 1:1) ==================== -->
  <div id="modal_sub_app_import" class="modal" style="display:none; position:fixed !important; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); z-index:99999 !important; align-items:center; justify-content:center;">
    <div class="modal-box" style="margin:auto !important; position:relative !important; background:#ffffff; border-radius:6px; width:90%; max-width:680px; max-height:90vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 12px 36px rgba(0,0,0,0.25); border:1px solid #cbd5e1;">
      <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 20px; background:#337ab7; border-radius:5px 5px 0 0; color:#fff;">
        <h4 style="margin:0; font-size:16px; font-weight:bold; color:#fff; display:flex; align-items:center; gap:8px;">
          <i class="fa fa-download"></i> 수강자 가져오기
        </h4>
        <button type="button" onclick="closeSubsidyAppImportModal();" style="border:none; background:transparent; font-size:22px; cursor:pointer; color:#ffffff; opacity:0.85; line-height:1;">&times;</button>
      </div>'''

files_to_update = [
    r'c:\Users\user\My project\course\course_site\course_site\af\ad_lec\lists\sn\index.html',
    r'c:\Users\user\My project\course\course_site\course_site\af\ad_lec\lists\sn\3267\index.html'
]

for file_path in files_to_update:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. 수강자등록 모달 교체
    pattern_reg = re.compile(
        r'<!-- =+ 37\. 수강자등록 모달.*?-->\s*<div id="modal_sub_app_register".*?</div>\s*</div>\s*</div>',
        re.DOTALL
    )
    if not pattern_reg.search(content):
        print(f"Failed to find modal_sub_app_register in {file_path}")
        continue
    content = pattern_reg.sub(new_reg_modal, content)

    # 2. 신청자 검색 모달 헤더 교체
    pattern_search = re.compile(
        r'<!-- =+ 38\. 신청자 검색 팝업 모달.*?-->\s*<div id="modal_sub_app_search_student".*?<div style="display:flex; justify-content:space-between; align-items:center; padding:12px 18px; border-bottom:1px solid #e2e8f0; background:#f8fafc; border-radius:6px 6px 0 0;">\s*<h4 style="margin:0; font-size:15px; font-weight:bold; color:#1e293b;">신청자 검색</h4>\s*<button type="button" onclick="closeSubsidyAppSearchStudentModal\(\);".*?</button>\s*</div>',
        re.DOTALL
    )
    if pattern_search.search(content):
        content = pattern_search.sub(new_search_header, content)

    # 3. 수강자 가져오기 모달 헤더 교체
    pattern_import = re.compile(
        r'<!-- =+ 39\. 수강자 가져오기 모달.*?-->\s*<div id="modal_sub_app_import".*?<div style="display:flex; justify-content:space-between; align-items:center; padding:12px 18px; border-bottom:1px solid #e2e8f0; background:#f8fafc; border-radius:6px 6px 0 0;">\s*<h4 style="margin:0; font-size:15px; font-weight:bold; color:#1e293b;">수강자 가져오기</h4>\s*<button type="button" onclick="closeSubsidyAppImportModal\(\);".*?</button>\s*</div>',
        re.DOTALL
    )
    if pattern_import.search(content):
        content = pattern_import.sub(new_import_header, content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Successfully updated {file_path}")

