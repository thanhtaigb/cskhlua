/**
 * Script Bảng Tính Hoa Hồng CSKH
 * Lưu trữ file này trên GitHub và nhúng vào Blogger qua jsDelivr hoặc thẻ <script>
 */

(function() {
    // 1. Tự động tiêm CSS dành riêng cho Bảng tính hoa hồng
    const calcStyles = `
        .container-calc {
            background: rgba(255, 255, 255, 0.98);
            max-width: 480px;
            width: 100%;
            margin: 20px auto;
            padding: 30px 25px;
            border-radius: 24px;
            box-shadow: 0 10px 30px rgba(255, 133, 162, 0.25);
            border: 3px solid #ff85a2;
            box-sizing: border-box;
            font-family: inherit;
        }
        .container-calc h2 {
            color: #ff6b8e;
            text-align: center;
            font-size: 20px;
            text-transform: uppercase;
            margin: 10px 0 20px 0;
            font-weight: 700;
        }
        .container-calc .form-group {
            margin-bottom: 15px;
            text-align: left;
        }
        .container-calc label {
            display: block;
            margin-bottom: 6px;
            font-weight: bold;
            color: #ff6b8e;
            font-size: 13px;
        }
        .container-calc input[type="text"], 
        .container-calc input[type="number"] {
            width: 100%;
            padding: 12px 14px;
            border: 2px solid #ffccd5;
            border-radius: 12px;
            box-sizing: border-box;
            outline: none;
            font-size: 15px;
            transition: all 0.2s ease;
        }
        .container-calc input:focus {
            border-color: #ff85a2;
            box-shadow: 0 0 8px rgba(255, 133, 162, 0.35);
        }
        .container-calc .radio-group {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }
        .container-calc .radio-item {
            flex: 1;
        }
        .container-calc .radio-item input {
            display: none;
        }
        .container-calc .radio-item label {
            display: block;
            padding: 10px;
            text-align: center;
            background: #fff;
            border: 2px solid #ffccd5;
            border-radius: 12px;
            cursor: pointer;
            font-size: 13px;
            margin-bottom: 0;
            transition: all 0.2s ease;
        }
        .container-calc .radio-item input:checked + label {
            background: #ff85a2;
            color: #ffffff;
            border-color: #ff85a2;
            font-weight: bold;
        }
        .container-calc .btn-calc {
            width: 100%;
            padding: 14px;
            background: #ff85a2;
            color: white;
            border: none;
            border-radius: 30px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(255, 133, 162, 0.4);
            margin-top: 10px;
            transition: all 0.2s ease;
        }
        .container-calc .btn-calc:hover {
            background: #ff6b8e;
            transform: translateY(-2px);
        }
        .container-calc .error-msg {
            background: #fff5f5;
            color: #b71c1c;
            padding: 16px;
            border-radius: 14px;
            border: 1px solid #fed7d7;
            border-left: 5px solid #e53e3e;
            margin-top: 15px;
            font-size: 13px;
            text-align: left;
            display: none;
            line-height: 1.6;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(229, 62, 62, 0.08);
            animation: fadeInCalc 0.3s ease-out;
        }
        .container-calc .result-card {
            margin-top: 20px;
            padding: 16px;
            border: 2px dashed #ff85a2;
            border-radius: 14px;
            display: none;
            background: #fff9fa;
            animation: fadeInCalc 0.3s ease-out;
        }
        .container-calc .res-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 8px;
            margin-bottom: 8px;
            border-bottom: 1px solid #ffe5ec;
            padding-bottom: 6px;
            font-size: 14px;
        }
        .container-calc .res-row span:first-child {
            margin-right: auto;
            color: #555;
        }
        .container-calc .res-row span:last-child {
            font-weight: bold;
            color: #333;
        }
        .container-calc .total-row {
            color: #d63384 !important;
            font-weight: bold;
            font-size: 1.15em;
            border: none;
            padding-top: 8px;
            margin-bottom: 0;
        }
        .container-calc .total-row span:last-child {
            color: #d63384;
        }
        @keyframes fadeInCalc {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.innerHTML = calcStyles;
    document.head.appendChild(styleEl);
})();

// 2. Định dạng số nhập vào (hàng nghìn)
function formatInput(input) {
    let value = input.value.replace(/\D/g, "");
    if (value === "") {
        input.value = "";
        return;
    }
    input.value = Number(value).toLocaleString('en-US');
}

// 3. Hiển thị / Ẩn thông báo lỗi
function showErr(msg) {
    const errBox = document.getElementById('err-box');
    const resBox = document.getElementById('res-box');
    if (errBox) {
        errBox.innerHTML = msg; 
        errBox.style.display = 'block';
    }
    if (resBox) {
        resBox.style.display = 'none';
    }
}

function hideErr() {
    const errBox = document.getElementById('err-box');
    if (errBox) {
        errBox.style.display = 'none';
    }
}

// 4. Thuật toán tính toán hoa hồng
function tinh() {
    hideErr();
    const typeEl = document.querySelector('input[name="type"]:checked');
    if (!typeEl) return;
    const type = typeEl.value;

    const revRaw = document.getElementById('rev') ? document.getElementById('rev').value.replace(/,/g, "") : "0";
    const rev = parseFloat(revRaw) || 0;
    const dat = parseFloat(document.getElementById('dat') ? document.getElementById('dat').value : 0) || 0;
    const ord = parseFloat(document.getElementById('ord') ? document.getElementById('ord').value : 0) || 0;

    // Kiểm tra dữ liệu
    if (rev < 0 || dat < 0 || ord < 0) {
        showErr("⚠️ <b>Lỗi dữ liệu:</b><br/>• Các giá trị số liệu không thể là số âm!<br/>• Vui lòng kiểm tra lại nhé!");
        return;
    }
    if (dat === 0) {
        showErr("⚠️ <b>Thiếu thông tin:</b><br/>• Bạn chưa nhập số data đang giữ!<br/>• Hãy nhập data để tính hoa hồng.");
        return;
    }
    if (ord > dat) { 
        showErr("⚠️ <b>Logic không hợp lệ:</b><br/>• Số đơn chốt (" + ord + ") không thể lớn hơn Data (" + dat + ")!<br/>• Vui lòng kiểm tra lại số đơn thành công."); 
        return; 
    }

    const rate = (ord / dat) * 100;
    let stdRate = (type === 'probation') ? 7 : 8;
    let minRate = (type === 'probation') ? 3 : 4;
    let minTBD = 1150000;

    let pct = 2.0;
    if (rev >= 500000000) pct = 5.0;
    else if (rev >= 350000000) pct = 4.5;
    else if (rev >= 250000000) pct = 4.0;
    else if (rev >= 120000000) pct = 3.0;

    let baseCommission = 0;
    let ratio = rate / stdRate;
    if (ratio > 1.25) ratio = 1.25;

    const tbd = ord > 0 ? rev / ord : 0;
    
    // Điều kiện sàn tối thiểu
    if (rate < minRate) {
        let msg = (type === 'probation') 
            ? "<b>(╥﹏╥) Chưa đạt điều kiện nhận hoa hồng!</b><br/><br/>Tỉ lệ chốt thực của bạn là <b>" + rate.toFixed(2) + "%</b>.<br/>Mức tối thiểu thử việc yêu cầu: <b>3%</b>.<br/><br/>💪 Cố gắng hơn vào tháng tới nhé!" 
            : "<b>(╥﹏╥) Chưa đạt điều kiện nhận hoa hồng!</b><br/><br/>Tỉ lệ chốt thực của bạn là <b>" + rate.toFixed(2) + "%</b>.<br/>Mức tối thiểu chính thức yêu cầu: <b>4%</b>.<br/><br/>💪 Cố gắng hơn vào tháng tới nhé!";
        showErr(msg);
        return;
    }

    if (tbd < minTBD) {
        showErr("<b>(╥﹏╥) Chưa đạt điều kiện nhận hoa hồng!</b><br/><br/>Trung bình đơn đạt: <b>" + Math.round(tbd).toLocaleString('vi-VN') + "₫</b>.<br/>Yêu cầu tối thiểu: <b>1.150.000₫</b>.<br/><br/>💪 Ráng đẩy thêm các đơn giá trị cao nhé!");
        return;
    }

    baseCommission = rev * (pct / 100) * ratio;

    let bonusPct = 0;
    if (tbd >= 6500000) bonusPct = 20;
    else if (tbd >= 5500000) bonusPct = 15;
    else if (tbd >= 4500000) bonusPct = 10;
    else if (tbd >= 3500000) bonusPct = 5;

    let bonusAmount = baseCommission * (bonusPct / 100);
    let total = baseCommission + bonusAmount;

    // Xuất kết quả
    document.getElementById('r1').innerText = rate.toFixed(2) + '%';
    document.getElementById('r-ratio').innerText = ratio.toFixed(2);
    document.getElementById('r2').innerText = Math.round(baseCommission).toLocaleString('vi-VN') + '₫';
    document.getElementById('r-tbd').innerText = Math.round(tbd).toLocaleString('vi-VN') + '₫';
    document.getElementById('r2-pct').innerText = ' (' + pct + '%)';
    document.getElementById('r3').innerText = Math.round(bonusAmount).toLocaleString('vi-VN') + '₫';
    document.getElementById('r3-pct').innerText = bonusPct > 0 ? ' (+' + bonusPct + '%)' : '';
    document.getElementById('r4').innerText = Math.round(total).toLocaleString('vi-VN') + '₫';
    document.getElementById('res-box').style.display = 'block';
}