#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""환불/취소등록 모달 & 일괄등록 모달을 라이브 사이트 1:1 매핑으로 교체"""
import re

HTML_FILE = r"c:\Users\user\My project\course\course_site\course_site\af\ad_lec\lists\sn\index.html"

# 새 모달 HTML (라이브 사이트 1:1 매핑)
NEW_MODALS = '''    <!-- ==================== 18. Modal: 환불/취소등록 (#refundSinModal) ==================== -->
  <div class="modal-backdrop" id="refundSinModal" onclick="if(event.target===this) closeRefundSinModal();" style="display:none; position: fixed !important; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 99999 !important;">
    <div class="modal-box" style="max-width: 820px; width: 95%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); margin: auto !important; position: relative !important; background: #fff;">
      <div class="modal-header" style="background: #428bca; border-bottom: 1px solid #357ebd; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center;">
        <h3 class="modal-title" style="margin: 0; font-size: 16px; font-weight: bold; color: #fff;"><i class="fa fa-calculator" style="margin-right: 6px;"></i> 환불/취소신청</h3>
        <button type="button" class="close-btn" onclick="closeRefundSinModal()" style="color: #fff; background: none; border: none; font-size: 22px; cursor: pointer; line-height: 1;">&times;</button>
      </div>
      <div class="modal-body" style="padding: 16px 20px; overflow-y: auto; flex: 1; background: #fff;">
        <div style="margin-bottom:10px; font-size:12px; color:#31708f;">
          <i class="fa fa-check-square" style="color:#428bca;"></i> 표시가 있는 항목은 반드시 입력해야 합니다.
        </div>
        <form id="fm_refund_sin" onsubmit="event.preventDefault(); submitRefundSin(event); return false;">
          <table class="table table-bordered list" style="width:100%; border-collapse:collapse; margin-bottom:10px; font-size:12px;">
            <colgroup><col width="130"><col width=""></colgroup>
            <tbody>
              <!-- 신청유형 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">신청유형 <i class="fa fa-check-square-o" style="font-size:11px; color:#428bca;"></i></th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <label style="margin:0 16px 0 0; cursor:pointer; font-weight:normal; display:inline-flex; align-items:center; gap:5px;"><input type="radio" name="ref_sin_app_type" id="ref_sin_type_cancel" value="수강취소" checked onchange="onRefundTypeChanged();"> 수강취소</label>
                  <label style="margin:0; cursor:pointer; font-weight:normal; display:inline-flex; align-items:center; gap:5px;"><input type="radio" name="ref_sin_app_type" id="ref_sin_type_partial" value="기타" onchange="onRefundTypeChanged();"> 기타(수강을 취소하지 않고 부분 환불)</label>
                </td>
              </tr>
              <!-- 강좌구분 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">강좌구분 <i class="fa fa-check-square-o" style="font-size:11px; color:#428bca;"></i></th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <select id="ref_sin_div" class="form-control input-sm" onchange="onRefundDivChanged();" style="width:120px; height:30px; line-height:normal !important; box-sizing:border-box !important; vertical-align:middle;">
                    <option value="26년 10월" selected>26년 10월</option>
                    <option value="26년 9월">26년 9월</option>
                    <option value="26년 8월">26년 8월</option>
                  </select>
                </td>
              </tr>
              <!-- 강좌 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">강좌 <i class="fa fa-check-square-o" style="font-size:11px; color:#428bca;"></i></th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <select id="ref_sin_course" class="form-control input-sm" onchange="onRefundCourseChanged();" style="min-width:260px; height:30px; line-height:normal !important; box-sizing:border-box !important; vertical-align:middle;" required>
                    <option value="">= 강좌 선택 =</option>
                  </select>
                </td>
              </tr>
              <!-- 학생정보 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">학생정보 <i class="fa fa-check-square-o" style="font-size:11px; color:#428bca;"></i></th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <input type="text" id="ref_sin_student_info" placeholder="학생이름 또는 학년-반-번호 입력" style="width:300px; height:30px; border:1px solid #ccc; border-radius:3px; padding:0 8px; font-size:12px;">
                    <button type="button" class="btn btn-default btn-sm" onclick="searchRefundStudent();" style="height:30px; padding:0 12px; display:inline-flex; align-items:center; gap:5px; font-weight:bold;"><i class="fa fa-search"></i> 검색하기</button>
                  </div>
                  <div id="ref_sin_student_result" style="margin-top:6px; font-size:12px; color:#333;"></div>
                  <input type="hidden" id="ref_sin_grade" value="">
                  <input type="hidden" id="ref_sin_classNo" value="">
                  <input type="hidden" id="ref_sin_studentNo" value="">
                  <input type="hidden" id="ref_sin_studentName" value="">
                  <input type="hidden" id="ref_sin_parentPhone" value="">
                </td>
              </tr>
              <!-- 최종수강일 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">최종수강일 <i class="fa fa-check-square-o" style="font-size:11px; color:#428bca;"></i></th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <input type="date" id="ref_sin_lastAttendedDate" style="width:150px; height:30px; border:1px solid #ccc; border-radius:3px; padding:0 6px; font-size:12px;" onchange="calculateRefundModalAmounts();">
                  <span style="font-size:11px; color:#888; margin-left:6px;">(수업 전 취소인 경우 취소 일자를 선택하세요)</span>
                  <div style="font-size:11px; color:#999; margin-top:3px;">(운영기간 : <span id="ref_sin_period_label">2026-10-01 ~ 2026-10-30</span>)</div>
                </td>
              </tr>
              <!-- 신청사유 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">신청사유 <i class="fa fa-check-square-o" style="font-size:11px; color:#428bca;"></i></th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <input type="text" id="ref_sin_reason" style="width:100%; height:30px; border:1px solid #ccc; border-radius:3px; padding:0 8px; font-size:12px;" placeholder="환불/취소 신청 사유를 입력하세요">
                </td>
              </tr>
              <!-- 강좌 총 시수 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">강좌 총 시수 <i class="fa fa-check-square-o" style="font-size:11px; color:#428bca;"></i></th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <span id="ref_sin_totalDays_label" style="font-weight:bold;">0시간</span>
                  <input type="hidden" id="ref_sin_totalDays" value="0">
                </td>
              </tr>
              <!-- 강좌 수강 시수 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">강좌 수강 시수 <i class="fa fa-check-square-o" style="font-size:11px; color:#428bca;"></i></th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <input type="number" id="ref_sin_attendedDays" value="" min="0" style="width:65px; height:30px; border:1px solid #ccc; border-radius:3px; text-align:right; padding:0 6px;" onchange="calculateRefundModalAmounts();" oninput="calculateRefundModalAmounts();">
                  <span style="margin-left:4px;">시간</span>
                </td>
              </tr>
              <!-- 환불금액산출 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:top; padding-top:14px;" rowspan="3">환불금액<br>산출</th>
                <td style="border:1px solid #ddd; border-bottom:1px solid #eee; padding:8px 12px; vertical-align:middle;">
                  <strong style="font-size:12px; margin-right:10px;">환불계산방식</strong>
                  <label style="margin:0 14px 0 0; cursor:pointer; font-weight:normal; display:inline-flex; align-items:center; gap:4px;"><input type="radio" name="ref_calc_rule" value="분할" onchange="calculateRefundModalAmounts();"> 분할</label>
                  <label style="margin:0 14px 0 0; cursor:pointer; font-weight:normal; display:inline-flex; align-items:center; gap:4px;"><input type="radio" name="ref_calc_rule" value="일할" checked onchange="calculateRefundModalAmounts();"> 일할</label>
                  <label style="margin:0; cursor:pointer; font-weight:normal; display:inline-flex; align-items:center; gap:4px;"><input type="radio" name="ref_calc_rule" value="기타" onchange="calculateRefundModalAmounts();"> 기타</label>
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #ddd; border-top:0; border-bottom:1px solid #eee; padding:8px 12px; vertical-align:top;">
                  <strong style="font-size:12px; display:block; margin-bottom:4px;">분할기준선택</strong>
                  <select id="ref_sin_calc_standard" class="form-control input-sm" onchange="calculateRefundModalAmounts();" style="width:370px; height:30px; line-height:normal !important; box-sizing:border-box !important;">
                    <option value="1/3,1/2">1/3경과 전 (2/3 환불), 1/2경과 전 (1/2 환불)</option>
                    <option value="1/2only">1/2경과 전 (1/2 환불)만 적용</option>
                  </select>
                  <div style="margin-top:4px; font-size:11px; color:#d9534f; line-height:1.6;">
                    예1) 1/2경과 <strong>전</strong>은 자신을 포함하지 않음(총 8회에서 4회를 들어도 환불 안함)<br>
                    예2) 1/2경과 <strong>이전</strong>은 자신을 포함(총 8회에서 4회를 들었다면 1/2 환불)
                  </div>
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #ddd; border-top:0; padding:8px 12px; vertical-align:top;">
                  <strong style="font-size:12px; display:block; margin-bottom:4px;">환불금액 조정</strong>
                  <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap; margin-bottom:4px;">
                    <span>버림 : <input type="number" id="ref_sin_round_down" value="5" min="0" style="width:52px; height:28px; border:1px solid #ccc; text-align:right; padding:0 4px;" onchange="calculateRefundModalAmounts();"> 원 미만이면 버림</span>
                    <span>올림 : <input type="number" id="ref_sin_round_up" value="5" min="0" style="width:52px; height:28px; border:1px solid #ccc; text-align:right; padding:0 4px;" onchange="calculateRefundModalAmounts();"> 원 이상이면 올림</span>
                  </div>
                  <div style="font-size:11px; color:#666; line-height:1.6;">
                    ※ 기준 금액이 0원인 경우 무시됩니다.<br>
                    예1) "5원 미만이면 버림", "5원 이상이면 올림"으로 설정하면 원단위 반올림이됩니다.<br>
                    예2) "10원 미만이면 버림", "0원 이상이면 올림"으로 설정하면 10원 미만 버림이됩니다.
                  </div>
                </td>
              </tr>
              <!-- 수강료(강사료+수용비) -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:top; padding-top:10px;" rowspan="7">수강료<br><small style="font-weight:normal; font-size:11px;">(강사료<br>+수용비)</small></th>
                <td style="border:1px solid #ddd; border-bottom:1px solid #eee; padding:7px 12px; vertical-align:middle;">
                  <span style="display:inline-block; width:85px; color:#555; font-weight:bold; font-size:12px;">징수금액</span>
                  <input type="number" id="ref_sin_fee" value="0" min="0" style="width:88px; height:28px; border:1px solid #ccc; text-align:right; padding:0 4px;" onchange="calculateRefundModalAmounts();" oninput="calculateRefundModalAmounts();">
                  <span style="margin:0 8px 0 2px;">원</span>
                  <button type="button" class="btn btn-success btn-xs" onclick="calculateRefundModalAmounts();" style="height:26px; padding:0 10px; font-weight:bold; background:#5cb85c; border-color:#4cae4c; color:#fff;">수강료 환불금액 계산</button>
                  <label style="margin-left:8px; font-weight:normal; cursor:pointer; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><input type="checkbox" id="ref_sin_excl_facility" onchange="calculateRefundModalAmounts();"> □일할계산 시 수강료에서 <strong>수용비를 제외한 금액</strong>으로 계산</label>
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #ddd; border-top:0; border-bottom:1px solid #eee; padding:7px 12px; vertical-align:middle;">
                  <span style="display:inline-block; width:85px; color:#555; font-weight:bold; font-size:12px;">환불금액</span>
                  <input type="number" id="ref_sin_tuitionRefund" value="0" style="width:88px; height:28px; border:1px solid #ccc; background:#ffff00; text-align:right; padding:0 4px; font-weight:bold;">
                  <span style="margin-left:4px;">원 (조정 전: <span id="ref_tuition_pre_adj">0</span>원)</span>
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #ddd; border-top:0; border-bottom:1px solid #eee; padding:7px 12px; vertical-align:middle;">
                  <span style="display:inline-block; width:85px; color:#555; font-weight:bold; font-size:12px;">환불 후 수강료</span>
                  <input type="number" id="ref_sin_fee_after" value="0" readonly style="width:88px; height:28px; border:1px solid #ccc; background:#f5f5f5; text-align:right; padding:0 4px;">
                  <span style="margin-left:4px;">원</span>
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #ddd; border-top:0; border-bottom:1px solid #eee; padding:7px 12px; vertical-align:middle;">
                  <span style="display:inline-block; width:85px; color:#555; font-weight:bold; font-size:12px;">수용비 징수금액</span>
                  <input type="number" id="ref_sin_receptiveFee" value="0" min="0" style="width:88px; height:28px; border:1px solid #ccc; text-align:right; padding:0 4px;" onchange="calculateRefundModalAmounts();" oninput="calculateRefundModalAmounts();">
                  <span style="margin-left:4px;">원</span>
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #ddd; border-top:0; border-bottom:1px solid #eee; padding:7px 12px; vertical-align:top;">
                  <span style="display:inline-block; width:85px; color:#555; font-weight:bold; font-size:12px;">수용비 환불금액</span>
                  <input type="number" id="ref_sin_receptiveRefund" value="0" style="width:88px; height:28px; border:1px solid #ccc; background:#ffff00; text-align:right; padding:0 4px; font-weight:bold;">
                  <span style="margin:0 6px 0 2px;">원</span>
                  <button type="button" class="btn btn-success btn-xs" onclick="calcFacilityRefund();" style="height:26px; padding:0 10px; font-weight:bold; background:#5cb85c; border-color:#4cae4c; color:#fff;">수용비 환불금액 계산</button>
                  <div style="font-size:11px; color:#888; margin-top:2px; margin-left:89px;">※ 환불에 따른 수용비 변동이 있는 경우 자동 계산(비율) 또는 직접 금액을 수정하시기 바랍니다.</div>
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #ddd; border-top:0; border-bottom:1px solid #eee; padding:7px 12px; vertical-align:middle;">
                  <span style="display:inline-block; width:85px; color:#555; font-weight:bold; font-size:12px;">환불 후 수용비</span>
                  <input type="number" id="ref_sin_receptive_after" value="0" readonly style="width:88px; height:28px; border:1px solid #ccc; background:#f5f5f5; text-align:right; padding:0 4px;">
                  <span style="margin-left:4px;">원</span>
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #ddd; border-top:0; padding:7px 12px; vertical-align:middle;">
                  <span style="display:inline-block; width:85px; color:#555; font-weight:bold; font-size:12px;">환불 후 강사료</span>
                  <input type="number" id="ref_sin_lecturer_after" value="0" readonly style="width:88px; height:28px; border:1px solid #ccc; background:#f5f5f5; text-align:right; padding:0 4px;">
                  <span style="margin-left:4px;">원 (환불 후 수강료 - 환불 후 수용비)</span>
                </td>
              </tr>
              <!-- 교재비 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:top; padding-top:10px;" rowspan="3">교재비</th>
                <td style="border:1px solid #ddd; border-bottom:1px solid #eee; padding:7px 12px; vertical-align:middle;">
                  <span style="display:inline-block; width:85px; color:#555; font-weight:bold; font-size:12px;">징수금액</span>
                  <input type="number" id="ref_sin_textbookFee" value="0" min="0" style="width:88px; height:28px; border:1px solid #ccc; text-align:right; padding:0 4px;">
                  <span style="margin-left:4px;">원</span>
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #ddd; border-top:0; border-bottom:1px solid #eee; padding:7px 12px; vertical-align:middle;">
                  <span style="display:inline-block; width:85px; color:#555; font-weight:bold; font-size:12px;">환불금액</span>
                  <input type="number" id="ref_sin_textbookRefund" value="0" style="width:88px; height:28px; border:1px solid #ccc; background:#ffff00; text-align:right; padding:0 4px; font-weight:bold;">
                  <span style="margin-left:4px;">원</span>
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #ddd; border-top:0; padding:7px 12px; vertical-align:middle;">
                  <span style="display:inline-block; width:85px; color:#555; font-weight:bold; font-size:12px;">환불 후 교재비</span>
                  <input type="number" id="ref_sin_textbook_after" value="0" readonly style="width:88px; height:28px; border:1px solid #ccc; background:#f5f5f5; text-align:right; padding:0 4px;">
                  <span style="margin-left:4px;">원</span>
                </td>
              </tr>
              <!-- 재료비 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:top; padding-top:10px;" rowspan="2">재료비</th>
                <td style="border:1px solid #ddd; border-bottom:1px solid #eee; padding:7px 12px; vertical-align:middle;">
                  <span style="display:inline-block; width:85px; color:#555; font-weight:bold; font-size:12px;">환불금액</span>
                  <input type="number" id="ref_sin_materialRefund" value="0" style="width:88px; height:28px; border:1px solid #ccc; background:#ffff00; text-align:right; padding:0 4px; font-weight:bold;">
                  <span style="margin-left:4px;">원</span>
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #ddd; border-top:0; padding:7px 12px; vertical-align:middle;">
                  <span style="display:inline-block; width:85px; color:#555; font-weight:bold; font-size:12px;">환불 후 재료비</span>
                  <input type="number" id="ref_sin_material_after" value="0" readonly style="width:88px; height:28px; border:1px solid #ccc; background:#f5f5f5; text-align:right; padding:0 4px;">
                  <span style="margin-left:4px;">원</span>
                </td>
              </tr>
              <!-- 징수 전 취소 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">징수 전 취소</th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <label style="margin:0; cursor:pointer; font-weight:normal; display:inline-flex; align-items:center; gap:6px;">
                    <input type="checkbox" id="ref_sin_beforeCollection" onchange="calculateRefundModalAmounts();">
                    징수 전에 취소되어 <strong style="color:#d9534f;">환불 금액이 없는 경우 선택</strong>
                  </label>
                </td>
              </tr>
              <!-- 비고 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">비고</th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <input type="text" id="ref_sin_note" style="width:100%; height:30px; border:1px solid #ccc; border-radius:3px; padding:0 8px; font-size:12px;" placeholder="신청자에게 전달할 내용을 입력하세요(환불 불가 사유, 처리 중 안내글 등 ..)">
                </td>
              </tr>
              <!-- 신청상태 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">신청상태</th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <label style="margin:0 16px 0 0; cursor:pointer; font-weight:normal; display:inline-flex; align-items:center; gap:5px;"><input type="radio" name="ref_sin_status" value="접수" checked> 접수</label>
                  <label style="margin:0 16px 0 0; cursor:pointer; font-weight:normal; display:inline-flex; align-items:center; gap:5px;"><input type="radio" name="ref_sin_status" value="강사확인"> 강사확인</label>
                  <label style="margin:0; cursor:pointer; font-weight:normal; display:inline-flex; align-items:center; gap:5px;"><input type="radio" name="ref_sin_status" value="처리완료"> 처리완료</label>
                </td>
              </tr>
            </tbody>
          </table>
          <div style="display:flex; justify-content:center; gap:10px; margin-top:14px;">
            <button type="button" id="btn_ref_sin_submit" onclick="submitRefundSin(event);" class="btn btn-danger btn-sm" style="height:32px; padding:0 28px; display:inline-flex; align-items:center; justify-content:center; line-height:1; font-weight:bold;">등록</button>
            <button type="button" class="btn btn-default btn-sm" onclick="closeRefundSinModal();" style="height:32px; padding:0 20px; display:inline-flex; align-items:center; justify-content:center; line-height:1; font-weight:bold;">목록보기</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- ==================== 19. Modal: 환불/취소 일괄등록 (#refundBatchModal) ==================== -->
  <div class="modal-backdrop" id="refundBatchModal" onclick="if(event.target===this) closeRefundBatchModal();" style="display:none; position: fixed !important; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 99999 !important;">
    <div class="modal-box" style="max-width: 860px; width: 95%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); margin: auto !important; position: relative !important; background: #fff;">
      <div class="modal-header" style="background: #f0ad4e; border-bottom: 1px solid #eea236; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center;">
        <h3 class="modal-title" style="margin: 0; font-size: 16px; font-weight: bold; color: #fff;"><i class="fa fa-file-excel-o" style="margin-right: 6px;"></i> 환불/취소일괄등록</h3>
        <button type="button" class="close-btn" onclick="closeRefundBatchModal()" style="color: #fff; background: none; border: none; font-size: 22px; cursor: pointer; line-height: 1;">&times;</button>
      </div>
      <div class="modal-body" style="padding: 16px 20px; overflow-y: auto; flex: 1; background: #fff;">
        <div style="background:#fcf8e3; border:1px solid #faebcc; border-radius:4px; padding:10px 14px; margin-bottom:10px; font-size:12px; color:#8a6d3b; line-height:1.7;">
          <strong style="color:#d9534f;">❶</strong> 일괄 등록은 <strong style="text-decoration:underline;">수강료로 환불 금액이 동일</strong>한 수강생의 <strong style="text-decoration:underline;">수강료를 환불해 줄 때</strong>에만 이용하세요.
        </div>
        <div style="margin-bottom:10px; font-size:12px; color:#31708f;">
          <i class="fa fa-check-square" style="color:#428bca;"></i> 표시가 있는 항목은 반드시 입력해야 합니다.
        </div>
        <form id="fm_refund_batch" onsubmit="event.preventDefault(); submitRefundBatch(); return false;">
          <table class="table table-bordered list" style="width:100%; border-collapse:collapse; margin-bottom:10px; font-size:12px;">
            <colgroup><col width="130"><col width=""></colgroup>
            <tbody>
              <!-- 신청유형 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">신청유형 <i class="fa fa-check-square-o" style="font-size:11px; color:#428bca;"></i></th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <label style="margin:0 16px 0 0; cursor:pointer; font-weight:normal; display:inline-flex; align-items:center; gap:5px;"><input type="radio" name="ref_batch_app_type" value="수강취소" checked> 수강취소</label>
                  <label style="margin:0; cursor:pointer; font-weight:normal; display:inline-flex; align-items:center; gap:5px;"><input type="radio" name="ref_batch_app_type" value="기타"> 기타(수강을 취소하지 않고 부분 환불)</label>
                </td>
              </tr>
              <!-- 강좌구분 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">강좌구분 <i class="fa fa-check-square-o" style="font-size:11px; color:#428bca;"></i></th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <select id="ref_batch_div" class="form-control input-sm" onchange="onRefundBatchDivChanged();" style="width:120px; height:30px; line-height:normal !important; box-sizing:border-box !important; vertical-align:middle;">
                    <option value="26년 10월" selected>26년 10월</option>
                    <option value="26년 9월">26년 9월</option>
                    <option value="26년 8월">26년 8월</option>
                  </select>
                </td>
              </tr>
              <!-- 강좌 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">강좌 <i class="fa fa-check-square-o" style="font-size:11px; color:#428bca;"></i></th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <select id="ref_batch_course" class="form-control input-sm" onchange="onRefundBatchCourseChanged();" style="min-width:260px; height:30px; line-height:normal !important; box-sizing:border-box !important; vertical-align:middle;" required>
                    <option value="">= 강좌 선택 =</option>
                  </select>
                </td>
              </tr>
              <!-- 학생목록 체크박스 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:top; padding-top:12px;">학생목록 <i class="fa fa-check-square-o" style="font-size:11px; color:#428bca;"></i><br><input type="checkbox" id="ref_batch_chk_all" onclick="toggleRefundBatchAllStudents(this);" style="margin-top:6px;"></th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <div id="ref_batch_student_list" style="min-height:60px; font-size:12px; color:#888;">강좌를 선택하면 학생 목록이 표시됩니다.</div>
                  <div style="margin-top:6px; font-size:11px; color:#d9534f;"><i class="fa fa-times-circle"></i> 강좌 수강료와 신청자 수강료가 다르거나, 환불(수강취소) 내역이 있는 학생은 선택할 수 없습니다.</div>
                </td>
              </tr>
              <!-- 최종수강일 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">최종수강일 <i class="fa fa-check-square-o" style="font-size:11px; color:#428bca;"></i></th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <input type="date" id="ref_batch_lastDate" style="width:150px; height:30px; border:1px solid #ccc; border-radius:3px; padding:0 6px; font-size:12px;" onchange="calculateRefundBatchAmounts();">
                  <span style="font-size:11px; color:#888; margin-left:6px;">(수업 전 취소인 경우 취소 일자를 선택하세요)</span>
                  <div style="font-size:11px; color:#999; margin-top:3px;">(운영기간 : <span id="ref_batch_period_label">2026-10-01 ~ 2026-10-30</span>)</div>
                </td>
              </tr>
              <!-- 신청사유 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">신청사유 <i class="fa fa-check-square-o" style="font-size:11px; color:#428bca;"></i></th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <input type="text" id="ref_batch_reason" style="width:100%; height:30px; border:1px solid #ccc; border-radius:3px; padding:0 8px; font-size:12px;" placeholder="환불/취소 신청 사유를 입력하세요">
                </td>
              </tr>
              <!-- 강좌 총 시수 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">강좌 총 시수 <i class="fa fa-check-square-o" style="font-size:11px; color:#428bca;"></i></th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <span id="ref_batch_totalDays_label" style="font-weight:bold;">0시간</span>
                  <input type="hidden" id="ref_batch_totalDays" value="0">
                </td>
              </tr>
              <!-- 강좌 수강 시수 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">강좌 수강 시수 <i class="fa fa-check-square-o" style="font-size:11px; color:#428bca;"></i></th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <input type="number" id="ref_batch_attendedDays" value="" min="0" style="width:65px; height:30px; border:1px solid #ccc; border-radius:3px; text-align:right; padding:0 6px;" onchange="calculateRefundBatchAmounts();" oninput="calculateRefundBatchAmounts();">
                  <span style="margin-left:4px;">시간</span>
                </td>
              </tr>
              <!-- 환불금액산출 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:top; padding-top:14px;" rowspan="3">환불금액<br>산출</th>
                <td style="border:1px solid #ddd; border-bottom:1px solid #eee; padding:8px 12px; vertical-align:middle;">
                  <strong style="font-size:12px; margin-right:10px;">환불계산방식</strong>
                  <label style="margin:0 14px 0 0; cursor:pointer; font-weight:normal; display:inline-flex; align-items:center; gap:4px;"><input type="radio" name="ref_batch_calc_rule" value="분할" onchange="calculateRefundBatchAmounts();"> 분할</label>
                  <label style="margin:0 14px 0 0; cursor:pointer; font-weight:normal; display:inline-flex; align-items:center; gap:4px;"><input type="radio" name="ref_batch_calc_rule" value="일할" checked onchange="calculateRefundBatchAmounts();"> 일할</label>
                  <label style="margin:0; cursor:pointer; font-weight:normal; display:inline-flex; align-items:center; gap:4px;"><input type="radio" name="ref_batch_calc_rule" value="기타" onchange="calculateRefundBatchAmounts();"> 기타</label>
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #ddd; border-top:0; border-bottom:1px solid #eee; padding:8px 12px; vertical-align:top;">
                  <strong style="font-size:12px; display:block; margin-bottom:4px;">분할기준선택</strong>
                  <select id="ref_batch_calc_standard" class="form-control input-sm" onchange="calculateRefundBatchAmounts();" style="width:370px; height:30px; line-height:normal !important; box-sizing:border-box !important;">
                    <option value="1/3,1/2">1/3경과 전 (2/3 환불), 1/2경과 전 (1/2 환불)</option>
                    <option value="1/2only">1/2경과 전 (1/2 환불)만 적용</option>
                  </select>
                  <div style="margin-top:4px; font-size:11px; color:#d9534f; line-height:1.6;">
                    예1) 1/2경과 <strong>전</strong>은 자신을 포함하지 않음(총 8회에서 4회를 들어도 환불 안함)<br>
                    예2) 1/2경과 <strong>이전</strong>은 자신을 포함(총 8회에서 4회를 들었다면 1/2 환불)
                  </div>
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #ddd; border-top:0; padding:8px 12px; vertical-align:top;">
                  <strong style="font-size:12px; display:block; margin-bottom:4px;">환불금액 조정</strong>
                  <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap; margin-bottom:4px;">
                    <span>버림 : <input type="number" id="ref_batch_round_down" value="5" min="0" style="width:52px; height:28px; border:1px solid #ccc; text-align:right; padding:0 4px;" onchange="calculateRefundBatchAmounts();"> 원 미만이면 버림</span>
                    <span>올림 : <input type="number" id="ref_batch_round_up" value="5" min="0" style="width:52px; height:28px; border:1px solid #ccc; text-align:right; padding:0 4px;" onchange="calculateRefundBatchAmounts();"> 원 이상이면 올림</span>
                  </div>
                  <div style="font-size:11px; color:#666; line-height:1.6;">
                    ※ 기준 금액이 0원인 경우 무시됩니다.<br>
                    예1) "5원 미만이면 버림", "5원 이상이면 올림"으로 설정하면 원단위 반올림이됩니다.<br>
                    예2) "10원 미만이면 버림", "0원 이상이면 올림"으로 설정하면 10원 미만 버림이됩니다.
                  </div>
                </td>
              </tr>
              <!-- 수강료(강사료+수용비) -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:top; padding-top:10px;" rowspan="7">수강료<br><small style="font-weight:normal; font-size:11px;">(강사료<br>+수용비)</small></th>
                <td style="border:1px solid #ddd; border-bottom:1px solid #eee; padding:7px 12px; vertical-align:middle;">
                  <span style="display:inline-block; width:85px; color:#555; font-weight:bold; font-size:12px;">징수금액</span>
                  <input type="number" id="ref_batch_fee" value="0" min="0" readonly style="width:88px; height:28px; border:1px solid #ccc; background:#f5f5f5; text-align:right; padding:0 4px;">
                  <span style="margin:0 8px 0 2px;">원</span>
                  <button type="button" class="btn btn-success btn-xs" onclick="calculateRefundBatchAmounts();" style="height:26px; padding:0 10px; font-weight:bold; background:#5cb85c; border-color:#4cae4c; color:#fff;">수강료 환불금액 계산</button>
                  <label style="margin-left:8px; font-weight:normal; cursor:pointer; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><input type="checkbox" id="ref_batch_excl_facility" onchange="calculateRefundBatchAmounts();"> □일할계산 시 수강료에서 <strong>수용비를 제외한 금액</strong>으로 계산</label>
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #ddd; border-top:0; border-bottom:1px solid #eee; padding:7px 12px; vertical-align:middle;">
                  <span style="display:inline-block; width:85px; color:#555; font-weight:bold; font-size:12px;">환불금액</span>
                  <input type="number" id="ref_batch_tuitionRefund" value="0" style="width:88px; height:28px; border:1px solid #ccc; background:#ffff00; text-align:right; padding:0 4px; font-weight:bold;">
                  <span style="margin-left:4px;">원 (조정 전: <span id="ref_batch_tuition_pre_adj">0</span>원)</span>
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #ddd; border-top:0; border-bottom:1px solid #eee; padding:7px 12px; vertical-align:middle;">
                  <span style="display:inline-block; width:85px; color:#555; font-weight:bold; font-size:12px;">환불 후 수강료</span>
                  <input type="number" id="ref_batch_fee_after" value="0" readonly style="width:88px; height:28px; border:1px solid #ccc; background:#f5f5f5; text-align:right; padding:0 4px;">
                  <span style="margin-left:4px;">원</span>
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #ddd; border-top:0; border-bottom:1px solid #eee; padding:7px 12px; vertical-align:middle;">
                  <span style="display:inline-block; width:85px; color:#555; font-weight:bold; font-size:12px;">수용비 징수금액</span>
                  <input type="number" id="ref_batch_receptiveFee" value="0" readonly style="width:88px; height:28px; border:1px solid #ccc; background:#f5f5f5; text-align:right; padding:0 4px;">
                  <span style="margin-left:4px;">원</span>
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #ddd; border-top:0; border-bottom:1px solid #eee; padding:7px 12px; vertical-align:top;">
                  <span style="display:inline-block; width:85px; color:#555; font-weight:bold; font-size:12px;">수용비 환불금액</span>
                  <input type="number" id="ref_batch_receptiveRefund" value="0" style="width:88px; height:28px; border:1px solid #ccc; background:#ffff00; text-align:right; padding:0 4px; font-weight:bold;">
                  <span style="margin:0 6px 0 2px;">원</span>
                  <button type="button" class="btn btn-success btn-xs" onclick="calcBatchFacilityRefund();" style="height:26px; padding:0 10px; font-weight:bold; background:#5cb85c; border-color:#4cae4c; color:#fff;">수용비 환불금액 계산</button>
                  <div style="font-size:11px; color:#888; margin-top:2px; margin-left:89px;">※ 환불에 따른 수용비 변동이 있는 경우 자동 계산(비율) 또는 직접 금액을 수정하시기 바랍니다.</div>
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #ddd; border-top:0; border-bottom:1px solid #eee; padding:7px 12px; vertical-align:middle;">
                  <span style="display:inline-block; width:85px; color:#555; font-weight:bold; font-size:12px;">환불 후 수용비</span>
                  <input type="number" id="ref_batch_receptive_after" value="0" readonly style="width:88px; height:28px; border:1px solid #ccc; background:#f5f5f5; text-align:right; padding:0 4px;">
                  <span style="margin-left:4px;">원</span>
                </td>
              </tr>
              <tr>
                <td style="border:1px solid #ddd; border-top:0; padding:7px 12px; vertical-align:middle;">
                  <span style="display:inline-block; width:85px; color:#555; font-weight:bold; font-size:12px;">환불 후 강사료</span>
                  <input type="number" id="ref_batch_lecturer_after" value="0" readonly style="width:88px; height:28px; border:1px solid #ccc; background:#f5f5f5; text-align:right; padding:0 4px;">
                  <span style="margin-left:4px;">원 (환불 후 수강료 - 환불 후 수용비)</span>
                </td>
              </tr>
              <!-- 징수 전 취소 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">징수 전 취소</th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <label style="margin:0; cursor:pointer; font-weight:normal; display:inline-flex; align-items:center; gap:6px;">
                    <input type="checkbox" id="ref_batch_beforeCollection" onchange="calculateRefundBatchAmounts();">
                    징수 전에 취소되어 <strong style="color:#d9534f;">환불 금액이 없는 경우 선택</strong>
                  </label>
                </td>
              </tr>
              <!-- 비고 -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:middle;">비고</th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:middle;">
                  <input type="text" id="ref_batch_note" style="width:100%; height:30px; border:1px solid #ccc; border-radius:3px; padding:0 8px; font-size:12px;" placeholder="신청자에게 전달할 내용을 입력하세요(환불 불가 사유, 처리 중 안내글 등 ..)">
                </td>
              </tr>
              <!-- 신청상태 (일괄: 처리완료만) -->
              <tr>
                <th style="background:#fbfbfb; border:1px solid #ddd; padding:8px 12px; font-weight:bold; color:#333; text-align:center; vertical-align:top; padding-top:12px;">신청상태</th>
                <td style="border:1px solid #ddd; padding:8px 12px; vertical-align:top;">
                  <label style="margin:0; cursor:pointer; font-weight:normal; display:inline-flex; align-items:center; gap:5px;"><input type="radio" name="ref_batch_status" value="처리완료" checked> 처리완료</label>
                  <div style="margin-top:8px; font-size:11px; color:#555; line-height:1.7; background:#f9f9f9; border:1px solid #eee; border-radius:3px; padding:8px 12px;">
                    - 신청자 "수강료"를 환불 후 금액으로 수정합니다.<br>
                    - 신청자 금액이 변경되었으므로 "자유수강권자 가져오기"를 다시 해 주세요.<br>
                    - '처리완료' 후 '접수' 또는 '강사확인'으로 변경할 수 없습니다.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div style="display:flex; justify-content:center; gap:10px; margin-top:14px;">
            <button type="button" id="btn_ref_batch_submit" onclick="submitRefundBatch();" class="btn btn-danger btn-sm" style="height:32px; padding:0 28px; display:inline-flex; align-items:center; justify-content:center; line-height:1; font-weight:bold; color:#fff;">등록</button>
            <button type="button" class="btn btn-default btn-sm" onclick="closeRefundBatchModal();" style="height:32px; padding:0 20px; display:inline-flex; align-items:center; justify-content:center; line-height:1; font-weight:bold;">목록보기</button>
          </div>
        </form>
      </div>
    </div>
  </div>'''

with open(HTML_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# 두 모달 시작~끝 패턴으로 교체
# refundSinModal 시작 마커
START_MARKER = '<!-- ==================== 18. Modal:'
# refundBatchModal 끝 마커 (마지막 </div>)
# 두 번째 모달의 마지막 </div></div></div> 뒤에 있는 공백과 스크립트 태그까지 찾기
END_MARKER_PATTERN = r'<!-- ={20,} 19\. Modal.*?</div>\s*</div>\s*</div>'

# 찾기
start_idx = content.find('<!-- ==================== 18. Modal:')
if start_idx == -1:
    print("ERROR: start marker not found")
    exit(1)

# end: 19번 모달의 마지막 </div></div></div>
match = re.search(END_MARKER_PATTERN, content[start_idx:], re.DOTALL)
if not match:
    print("ERROR: end marker not found")
    # 대안: 스크립트 태그 직전 찾기
    script_idx = content.find('<!-- Client Script -->', start_idx)
    if script_idx == -1:
        script_idx = content.find('<script src=', start_idx)
    end_idx = script_idx
else:
    end_idx = start_idx + match.end()

old_section = content[start_idx:end_idx]
print(f"Found section: {len(old_section)} chars, from idx {start_idx} to {end_idx}")
print(f"Section starts with: {repr(old_section[:80])}")
print(f"Section ends with: {repr(old_section[-80:])}")

new_content = content[:start_idx] + NEW_MODALS + '\n\n' + content[end_idx:]

with open(HTML_FILE, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"SUCCESS: Replaced modals. New file size: {len(new_content)} chars")
