// 合同款项计算器脚本

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const contractAmountInput = document.getElementById('contractAmount');
    const taxRateInput = document.getElementById('taxRate');
    const paymentTimesInput = document.getElementById('paymentTimes');
    const paymentRatioContainer = document.getElementById('paymentRatioContainer');
    const paymentRatiosContainer = document.getElementById('paymentRatios');
    const calculateBtn = document.getElementById('calculateBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultCard = document.getElementById('resultCard');
    const resultTableBody = document.getElementById('resultTableBody');
    const copyTableBtn = document.getElementById('copyTableBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    
    // 初始化付款比例输入框
    updatePaymentRatios();
    
    // 监听付款次数变化，动态更新付款比例输入框
    paymentTimesInput.addEventListener('change', updatePaymentRatios);
    
    // 计算按钮点击事件
    calculateBtn.addEventListener('click', calculatePayments);
    
    // 重置按钮点击事件
    resetBtn.addEventListener('click', resetForm);
    
    // 复制表格按钮点击事件
    copyTableBtn.addEventListener('click', copyTableToClipboard);
    
    // 导出Excel按钮点击事件
    exportExcelBtn.addEventListener('click', exportTableToExcel);
    
    // 更新付款比例输入框
    function updatePaymentRatios() {
        const paymentTimes = parseInt(paymentTimesInput.value) || 1;
        
        // 清空容器
        paymentRatiosContainer.innerHTML = '';
        
        // 创建新的输入框
        for (let i = 1; i <= paymentTimes; i++) {
            const colDiv = document.createElement('div');
            colDiv.className = 'col-md-4';
            
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            
            const span = document.createElement('span');
            span.className = 'input-group-text';
            span.textContent = `第${i}期付款比例(%)：`;
            
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'form-control payment-ratio';
            
            // 设置默认值
            if (i === 1 && paymentTimes === 1) {
                input.value = '100';
            } else if (i === 1) {
                input.value = '40';
            } else if (i === 2 && paymentTimes === 2) {
                input.value = '60';
            } else if (i === 2) {
                input.value = '50';
            } else if (i === 3) {
                input.value = '10';
            } else {
                input.value = '0';
            }
            
            inputGroup.appendChild(span);
            inputGroup.appendChild(input);
            colDiv.appendChild(inputGroup);
            paymentRatiosContainer.appendChild(colDiv);
        }
    }
    
    // 计算付款金额
    function calculatePayments() {
        // 获取输入值
        const contractAmount = parseFloat(contractAmountInput.value) || 0;
        const taxRate = parseFloat(taxRateInput.value) || 0;
        const paymentTimes = parseInt(paymentTimesInput.value) || 1;
        
        // 获取所有付款比例
        const ratioInputs = document.querySelectorAll('.payment-ratio');
        const ratios = [];
        let totalRatio = 0;
        
        for (let i = 0; i < ratioInputs.length; i++) {
            const ratio = parseFloat(ratioInputs[i].value) || 0;
            ratios.push(ratio);
            totalRatio += ratio;
        }
        
        // 验证比例总和是否为100%
        if (Math.abs(totalRatio - 100) > 0.01) {
            alert('付款比例总和必须为100%！');
            return;
        }
        
        // 清空结果表格
        resultTableBody.innerHTML = '';
        
        // 添加合同总额行
        const taxAmount = contractAmount * taxRate / 100;
        const pretaxAmount = contractAmount - taxAmount;
        
        addResultRow('合同总额', '100%', contractAmount, taxAmount, pretaxAmount, numberToChinese(contractAmount));
        
        // 添加各期付款行
        for (let i = 0; i < ratios.length; i++) {
            const ratio = ratios[i];
            const amount = contractAmount * ratio / 100;
            const tax = amount * taxRate / 100;
            const pretax = amount - tax;
            
            addResultRow(`第${i+1}期付款`, `${ratio}%`, amount, tax, pretax, numberToChinese(amount));
        }
        
        // 显示结果卡片
        resultCard.style.display = 'block';
    }
    
    // 添加结果行
    function addResultRow(stage, ratio, amount, tax, pretax, chinese) {
        const row = document.createElement('tr');
        
        // 添加单元格
        row.innerHTML = `
            <td>${stage}</td>
            <td>${ratio}</td>
            <td class="copyable-cell">¥${amount.toFixed(2)}</td>
            <td class="copyable-cell">¥${tax.toFixed(2)}</td>
            <td class="copyable-cell">¥${pretax.toFixed(2)}</td>
            <td class="copyable-cell">${chinese}</td>
        `;
        
        resultTableBody.appendChild(row);
        
        // 为可复制单元格添加点击事件
        const copyableCells = row.querySelectorAll('.copyable-cell');
        copyableCells.forEach(cell => {
            cell.addEventListener('click', function() {
                copyTextToClipboard(this.textContent);
                showCopyTooltip(this);
            });
        });
    }
    
    // 重置表单
    function resetForm() {
        contractAmountInput.value = '1000000';
        taxRateInput.value = '6';
        paymentTimesInput.value = '3';
        updatePaymentRatios();
        resultCard.style.display = 'none';
    }
    
    // 复制文本到剪贴板
    function copyTextToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    
    // 显示复制提示
    function showCopyTooltip(element) {
        const tooltip = document.createElement('div');
        tooltip.className = 'copy-tooltip';
        tooltip.textContent = '已复制';
        
        // 计算位置
        const rect = element.getBoundingClientRect();
        tooltip.style.top = `${rect.top - 30}px`;
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.transform = 'translateX(-50%)';
        
        document.body.appendChild(tooltip);
        
        // 2秒后移除提示
        setTimeout(() => {
            document.body.removeChild(tooltip);
        }, 2000);
    }
    
    // 复制表格到剪贴板
    function copyTableToClipboard() {
        const table = document.querySelector('.table');
        const range = document.createRange();
        range.selectNode(table);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        
        alert('表格已复制到剪贴板');
    }
    
    // 导出表格到Excel
    function exportTableToExcel() {
        const table = document.querySelector('.table');
        const html = table.outerHTML;
        const url = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(html);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = '合同款项计算结果.xls';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
});

// 数字转中文大写函数
function numberToChinese(num) {
    if (isNaN(num)) return "";
    
    const fraction = ['角', '分'];
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
    ];
    
    let head = num < 0 ? '负' : '';
    num = Math.abs(num);
    
    let s = '';
    
    // 处理小数部分
    let decimalPart = '';
    if (num.toString().indexOf('.') > 0) {
        let decimalStr = num.toString().split('.')[1];
        if (decimalStr.length > 2) {
            decimalStr = decimalStr.substring(0, 2);
        }
        
        for (let i = 0; i < decimalStr.length; i++) {
            if (decimalStr[i] !== '0') {
                decimalPart += digit[parseInt(decimalStr[i])] + fraction[i];
            }
        }
    }
    
    // 处理整数部分
    num = Math.floor(num);
    if (num === 0) {
        s = '零元';
    } else {
        let unitPos = 0;
        let strIns = '';
        let needZero = false;
        
        while (num > 0) {
            let section = num % 10000;
            if (needZero) {
                strIns = '零' + strIns;
            }
            strIns = sectionToChinese(section, unit[0][unitPos], unit[1]) + strIns;
            needZero = (section < 1000) && (section > 0);
            num = Math.floor(num / 10000);
            unitPos++;
        }
        s = strIns;
    }
    
    // 如果没有小数部分，添加"整"
    if (decimalPart === '') {
        s += "整";
    } else {
        s += decimalPart;
    }
    
    return head + s;
}

// 处理每个4位数段
function sectionToChinese(section, unitItem, units) {
    // 定义数字对应的中文
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    let strIns = '';
    let zero = true;
    let pos = 0;
    
    while (section > 0) {
        let v = section % 10;
        if (v === 0) {
            if (!zero) {
                zero = true;
                strIns = digit[v] + strIns;
            }
        } else {
            zero = false;
            strIns = digit[v] + (units[pos] || '') + strIns;
        }
        pos++;
        section = Math.floor(section / 10);
    }
    
    if (strIns !== '') {
        strIns += unitItem;
    }
    
    return strIns;
}