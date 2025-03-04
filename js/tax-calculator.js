/**
 * 数字金额转换为大写人民币
 * @param {number} money 金额
 * @returns {string} 大写金额
 */
function convertToChinese(money) {
    const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const cnIntRadice = ['', '拾', '佰', '仟'];
    const cnIntUnits = ['', '万', '亿', '兆'];
    const cnDecUnits = ['角', '分'];
    const cnInteger = '整';
    const cnIntLast = '元';
    
    let integral = Math.floor(money);
    let decimal = Math.round((money - integral) * 100);
    let chineseStr = '';
    
    if (integral === 0) {
        chineseStr = '零元';
        if (decimal === 0) {
            return chineseStr + cnInteger;
        }
    }
    
    let integerNum = integral.toString();
    let decimalNum = decimal.toString().padStart(2, '0');
    
    // 处理整数部分
    let zeroCount = 0;
    let i = 0;
    let p = integerNum.length - 1;
    while (p >= 0) {
        let d = parseInt(integerNum.substr(i, 1));
        let quotient = p % 4;
        if (d === 0) {
            zeroCount++;
        } else {
            if (zeroCount > 0) {
                chineseStr += cnNums[0];
            }
            zeroCount = 0;
            chineseStr += cnNums[d] + cnIntRadice[quotient];
        }
        if (quotient === 0 && zeroCount < 4) {
            chineseStr += cnIntUnits[Math.floor(p/4)];
        }
        p--;
        i++;
    }
    chineseStr += cnIntLast;
    
    // 处理小数部分
    if (decimal > 0) {
        for (let i = 0; i < 2; i++) {
            let d = parseInt(decimalNum.charAt(i));
            if (d !== 0) {
                chineseStr += cnNums[d] + cnDecUnits[i];
            }
        }
    } else {
        chineseStr += cnInteger;
    }
    
    return chineseStr;
}

/**
 * 计算含税金额
 */
function calculateWithTax() {
    const amount = parseFloat(document.getElementById('amount1').value);
    const rate = parseFloat(document.getElementById('rate1').value);
    
    if (isNaN(amount) || isNaN(rate)) {
        alert('请输入有效数字！');
        return;
    }
    
    const tax = amount * (rate/100);
    const result = amount + tax;
    
    // 显示结果表
    document.getElementById('resultTable1').classList.remove('hidden');
    
    // 更新表格数据
    document.getElementById('result1').textContent = `¥${result.toFixed(2)}`;
    document.getElementById('result1Chinese').textContent = convertToChinese(result);
    
    document.getElementById('result1WithoutTax').textContent = `¥${amount.toFixed(2)}`;
    document.getElementById('result1WithoutTaxChinese').textContent = convertToChinese(amount);
    
    document.getElementById('result1Tax').textContent = `¥${tax.toFixed(2)}`;
    document.getElementById('result1TaxChinese').textContent = convertToChinese(tax);
    
    document.getElementById('result1Rate').textContent = rate + '%';
    
    // 更新文本显示
    document.getElementById('textResult1').textContent = result.toFixed(2);
    document.getElementById('textResult1Chinese').textContent = convertToChinese(result);
    document.getElementById('textResult1WithoutTax').textContent = amount.toFixed(2);
    document.getElementById('textResult1WithoutTaxChinese').textContent = convertToChinese(amount);
    document.getElementById('textResult1Tax').textContent = tax.toFixed(2);
    document.getElementById('textResult1TaxChinese').textContent = convertToChinese(tax);
    document.getElementById('textResult1Rate').textContent = rate + '%';
    
    // 显示结果（根据当前选择的格式）
    const format = document.querySelector('.display-btn.active').dataset.format;
    updateDisplayFormat(format);
}

/**
 * 计算未含税金额
 */
function calculateWithoutTax() {
    const amount = parseFloat(document.getElementById('amount2').value);
    const rate = parseFloat(document.getElementById('rate2').value);
    
    if (isNaN(amount) || isNaN(rate)) {
        alert('请输入有效数字！');
        return;
    }
    
    const result = amount / (1 + rate/100);
    const tax = amount - result;
    
    // 显示结果表
    document.getElementById('resultTable2').classList.remove('hidden');
    
    // 更新表格数据
    document.getElementById('result2WithTax').textContent = `¥${amount.toFixed(2)}`;
    document.getElementById('result2WithTaxChinese').textContent = convertToChinese(amount);
    
    document.getElementById('result2').textContent = `¥${result.toFixed(2)}`;
    document.getElementById('result2Chinese').textContent = convertToChinese(result);
    
    document.getElementById('result2Tax').textContent = `¥${tax.toFixed(2)}`;
    document.getElementById('result2TaxChinese').textContent = convertToChinese(tax);
    
    document.getElementById('result2Rate').textContent = rate + '%';
    
    // 更新文本显示
    document.getElementById('textResult2WithTax').textContent = amount.toFixed(2);
    document.getElementById('textResult2WithTaxChinese').textContent = convertToChinese(amount);
    document.getElementById('textResult2').textContent = result.toFixed(2);
    document.getElementById('textResult2Chinese').textContent = convertToChinese(result);
    document.getElementById('textResult2Tax').textContent = tax.toFixed(2);
    document.getElementById('textResult2TaxChinese').textContent = convertToChinese(tax);
    document.getElementById('textResult2Rate').textContent = rate + '%';
    
    // 显示结果（根据当前选择的格式）
    const format = document.querySelector('.display-btn.active').dataset.format;
    updateDisplayFormat(format);
}

/**
 * 计算税率
 */
function calculateTaxRate() {
    const withTax = parseFloat(document.getElementById('withTax').value);
    const withoutTax = parseFloat(document.getElementById('withoutTax').value);
    
    if (isNaN(withTax) || isNaN(withoutTax)) {
        alert('请输入有效数字！');
        return;
    }
    
    const rate = ((withTax / withoutTax) - 1) * 100;
    document.getElementById('result3').textContent = rate.toFixed(2);
}

/**
 * 清除计算结果
 * @param {number} calculatorId 计算器编号
 */
function clearResult(calculatorId) {
    switch(calculatorId) {
        case 1:
            // 清除第一个计算器
            document.getElementById('amount1').value = '';
            document.getElementById('rate1').value = '6';
            document.getElementById('resultTable1').classList.add('hidden');
            break;
            
        case 2:
            // 清除第二个计算器
            document.getElementById('amount2').value = '';
            document.getElementById('rate2').value = '6';
            document.getElementById('resultTable2').classList.add('hidden');
            break;
            
        case 3:
            // 清除第三个计算器
            document.getElementById('withTax').value = '';
            document.getElementById('withoutTax').value = '';
            document.getElementById('result3').textContent = '0.00';
            break;
    }
    // 清除后更新本地存储
    saveInputValues();
}

/**
 * 初始化键盘事件监听
 */
function initKeyboardEvents() {
    // 为每个计算器添加键盘事件监听
    document.addEventListener('keydown', function(event) {
        // 获取当前焦点所在的计算器区域
        const activeElement = document.activeElement;
        const calcSection = activeElement.closest('.calc-section');
        
        if (!calcSection) return;
        
        // 确定当前在哪个计算器
        const sections = document.querySelectorAll('.calc-section');
        const calculatorId = Array.from(sections).indexOf(calcSection) + 1;
        
        switch(event.key) {
            case 'Enter':
                // 阻止默认的表单提交行为
                event.preventDefault();
                // 触发对应的计算函数
                switch(calculatorId) {
                    case 1:
                        calculateWithTax();
                        break;
                    case 2:
                        calculateWithoutTax();
                        break;
                    case 3:
                        calculateTaxRate();
                        break;
                }
                break;
                
            case 'Escape':
                // 触发清除功能
                clearResult(calculatorId);
                break;
        }
    });
}

/**
 * 保存输入值到本地存储
 */
function saveInputValues() {
    const inputValues = {
        amount1: document.getElementById('amount1').value,
        rate1: document.getElementById('rate1').value,
        amount2: document.getElementById('amount2').value,
        rate2: document.getElementById('rate2').value,
        withTax: document.getElementById('withTax').value,
        withoutTax: document.getElementById('withoutTax').value,
        // 添加时间戳
        timestamp: new Date().getTime()
    };
    localStorage.setItem('taxCalculatorInputs', JSON.stringify(inputValues));
}

/**
 * 从本地存储恢复输入值
 */
function restoreInputValues() {
    const savedValues = localStorage.getItem('taxCalculatorInputs');
    if (savedValues) {
        const inputValues = JSON.parse(savedValues);
        
        // 检查数据是否过期（24小时）
        const now = new Date().getTime();
        const oneDayInMs = 24 * 60 * 60 * 1000; // 一天的毫秒数
        
        if (now - inputValues.timestamp > oneDayInMs) {
            // 数据已过期，清除存储
            localStorage.removeItem('taxCalculatorInputs');
            // 重置为默认值
            resetToDefaults();
            return;
        }
        
        // 数据未过期，恢复输入值
        document.getElementById('amount1').value = inputValues.amount1;
        document.getElementById('rate1').value = inputValues.rate1;
        document.getElementById('amount2').value = inputValues.amount2;
        document.getElementById('rate2').value = inputValues.rate2;
        document.getElementById('withTax').value = inputValues.withTax;
        document.getElementById('withoutTax').value = inputValues.withoutTax;
    }
}

/**
 * 重置为默认值
 */
function resetToDefaults() {
    document.getElementById('amount1').value = '';
    document.getElementById('rate1').value = '6';
    document.getElementById('amount2').value = '';
    document.getElementById('rate2').value = '6';
    document.getElementById('withTax').value = '';
    document.getElementById('withoutTax').value = '';
}

/**
 * 为所有输入框添加保存事件
 */
function initSaveEvents() {
    const inputs = [
        'amount1', 'rate1',
        'amount2', 'rate2',
        'withTax', 'withoutTax'
    ];
    
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', saveInputValues);
    });
}

// 添加格式切换功能
function initDisplayOptions() {
    const displayBtns = document.querySelectorAll('.display-btn');
    displayBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 更新按钮状态
            displayBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 更新显示格式
            const format = this.dataset.format;
            updateDisplayFormat(format);
        });
    });
}

function updateDisplayFormat(format) {
    const tables = document.querySelectorAll('.result-table');
    const texts = document.querySelectorAll('.result-text');
    
    if (format === 'table') {
        tables.forEach(table => table.classList.remove('hidden'));
        texts.forEach(text => text.classList.add('hidden'));
    } else {
        tables.forEach(table => table.classList.add('hidden'));
        texts.forEach(text => text.classList.remove('hidden'));
    }
}

// 添加复制功能
function copyToClipboard(text) {
    // 创建临时textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        // 显示提示
        showCopyTip('复制成功！');
    } catch (err) {
        console.error('复制失败:', err);
        showCopyTip('复制失败，请手动复制');
    }
    
    document.body.removeChild(textarea);
}

// 显示复制提示
function showCopyTip(message) {
    const tip = document.createElement('div');
    tip.className = 'copy-tip';
    tip.textContent = message;
    document.body.appendChild(tip);
    
    // 2秒后移除提示
    setTimeout(() => {
        tip.classList.add('fade-out');
        setTimeout(() => document.body.removeChild(tip), 300);
    }, 2000);
}

// 格式化表格数据为文本
function formatTableToText(tableId) {
    const table = document.getElementById(tableId);
    let text = '';
    
    // 遍历表格行
    table.querySelectorAll('tbody tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
            const label = cells[0].textContent;
            const value = cells[1].textContent;
            // 如果是税率，不添加人民币符号
            if (label === '税率') {
                text += `${label}：${value}`;
            } else {
                // 如果值已经包含人民币符号，就直接使用
                text += `${label}：${value.startsWith('¥') ? value : '¥' + value}`;
            }
            if (cells.length > 2 && cells[2].textContent) {
                text += `（${cells[2].textContent}）`;
            }
            text += '\n';
        }
    });
    
    return text.trim();
}

// 格式化文本显示数据
function formatTextToClipboard(textId) {
    const container = document.getElementById(textId);
    return Array.from(container.querySelectorAll('.text-line'))
        .map(line => line.textContent.trim())
        .join('\n');
}

/**
 * 复制计算结果到剪贴板
 * @param {number} section - 计算区域编号
 */
function copyResults(section) {
    // 获取结果文本
    const resultDiv = document.getElementById(`resultText${section}`);
    const results = Array.from(resultDiv.getElementsByClassName('text-line'))
        .map(p => p.textContent.trim())
        .join('\n');
    
    // 创建临时文本区域
    const textarea = document.createElement('textarea');
    textarea.value = results;
    document.body.appendChild(textarea);
    
    // 选择并复制文本
    textarea.select();
    document.execCommand('copy');
    
    // 移除临时文本区域
    document.body.removeChild(textarea);
    
    // 显示复制成功提示
    const copyBtn = resultDiv.querySelector('.copy-btn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '复制成功！';
    copyBtn.style.backgroundColor = '#4CAF50';
    
    // 2秒后恢复按钮原始状态
    setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.backgroundColor = '';
    }, 2000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initKeyboardEvents();
    restoreInputValues();
    initSaveEvents();
    initDisplayOptions();
    
    // 为表格单元格添加点击复制功能
    document.querySelectorAll('.result-table td').forEach(cell => {
        cell.style.cursor = 'pointer';
        cell.title = '点击复制';
        cell.addEventListener('click', () => {
            const isRate = cell.parentElement.firstElementChild.textContent === '税率';
            const isChinese = cell.cellIndex === 2;
            const text = cell.textContent;
            const copyText = (!isRate && !isChinese && !text.startsWith('¥')) ? `¥${text}` : text;
            copyToClipboard(copyText);
        });
    });
    
    // 为文本显示区域添加复制按钮
    const resultTexts = document.querySelectorAll('.result-text');
    resultTexts.forEach((text, index) => {
        // 检查是否已经有复制按钮
        if (!text.querySelector('.copy-btn')) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = '复制结果';
            copyBtn.onclick = () => copyResults(index + 1);
            text.appendChild(copyBtn);
        }
    });
});

// 添加样式
const style = document.createElement('style');
style.textContent = `
    .copy-btn {
        padding: 6px 12px;
        background-color: #2196F3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
        margin-top: 10px;
    }
    .copy-btn:hover {
        background-color: #1976D2;
    }
`;
document.head.appendChild(style); 