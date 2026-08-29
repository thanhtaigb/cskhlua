(function(){
  function money(n){return Math.round(n).toLocaleString('vi-VN')+'₫';}
  window.formatCommissionInput=function(input){var v=input.value.replace(/\D/g,'');input.value=v?Number(v).toLocaleString('en-US'):'';};
  function error(msg){var e=document.getElementById('commission-error');e.innerHTML=msg;e.style.display='block';document.getElementById('commission-result').style.display='none';}
  window.calculateCommission=function(){
    var e=document.getElementById('commission-error');e.style.display='none';
    var type=document.querySelector('input[name="commission-type"]:checked').value;
    var rev=parseFloat(document.getElementById('commission-rev').value.replace(/,/g,''))||0;
    var dat=parseFloat(document.getElementById('commission-dat').value)||0,ord=parseFloat(document.getElementById('commission-ord').value)||0;
    if(rev<0)return error('⚠️ <b>Lỗi dữ liệu:</b><br>Doanh số không thể âm.');
    if(dat<0)return error('⚠️ <b>Lỗi dữ liệu:</b><br>Tổng data không thể âm.');
    if(ord<0)return error('⚠️ <b>Lỗi dữ liệu:</b><br>Số đơn chốt không thể âm.');
    if(dat===0)return error('⚠️ <b>Thiếu thông tin:</b><br>Hãy nhập số data đang giữ để tính hoa hồng.');
    if(ord>dat)return error('⚠️ <b>Logic không hợp lệ:</b><br>Đơn chốt không thể lớn hơn tổng data.');
    var rate=ord/dat*100,std=type==='probation'?7:8,min=type==='probation'?3:4,ratio=rate/std;
    if(ratio>1.25)ratio=1.25;var tbd=ord>0?rev/ord:0;
    if(rate<min)return error('⚠️ <b>Chưa đạt tỷ lệ chốt:</b><br>Tỷ lệ hiện tại '+rate.toFixed(2)+'%. Tối thiểu cần đạt '+min+'%.');
    if(tbd<1150000)return error('⚠️ <b>Chưa đạt trung bình đơn:</b><br>Trung bình đơn tối thiểu là 1.150.000₫.');
    var pct=rev>=500000000?5:rev>=350000000?4.5:rev>=250000000?4:rev>=120000000?3:2;
    var base=rev*(pct/100)*ratio,bonus= tbd>=6500000?20:tbd>=5500000?15:tbd>=4500000?10:tbd>=3500000?5:0,bonusAmount=base*bonus/100;
    document.getElementById('commission-r1').innerText=rate.toFixed(2)+'%';document.getElementById('commission-r-ratio').innerText=ratio.toFixed(2);document.getElementById('commission-r2').innerText=money(base);document.getElementById('commission-tbd').innerText=money(tbd);document.getElementById('commission-r2-pct').innerText=' ('+pct+'%)';document.getElementById('commission-r3').innerText=money(bonusAmount);document.getElementById('commission-r3-pct').innerText=bonus?' (+'+bonus+'%)':'';document.getElementById('commission-r4').innerText=money(base+bonusAmount);document.getElementById('commission-result').style.display='block';
  };
})();
