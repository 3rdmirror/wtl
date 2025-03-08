/**
 * 税金计算器功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const calcType1 = document.getElementById('calcType1');
    const calcType2 = document.getElementById('calcType2');
    const calcType3 = document.getElementById('calcType3');
    const includeTaxForm = document.getElementById('includeTaxForm');
    const excludeTaxForm = document.getElementById('excludeTaxForm');
    const taxRateForm = document.getElementById('taxRateForm');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultContainer = document.getElementById('resultContainer');
    const copyTableBtn = document.getElementById('copyTableBtn');
    
    // 切换计算模式
    calcType1.addEventListener('change', function() {
        if(this.checked) {
            includeTaxForm.style.display = 'block';
            excludeTaxForm.style.display = 'none';
            taxRateForm.style.display = 'none';
        }
    });
    
    calcType2.addEventListener('change', function() {
        if(this.checked) {
            includeTaxForm.style.display = 'none';
            excludeTaxForm.style.display = 'block';
            taxRateForm.style.display = 'none';
        }
    });
    
    calcType3.addEventListener('change', function() {
        if(this.checked) {
            includeTaxForm.style.display = 'none';
            excludeTaxForm.style.display = 'none';
            taxRateForm.style.display = 'block';
        }
    });
    
    // 计算按钮点击事件
    calculateBtn.addEventListener('click', function() {
        let excludedAmount = 0;
        let includedAmount = 0;
        let taxAmount = 0;
        let taxRate = 0;
        
        // 根据选择的计算模式进行计算
        if(calcType1.checked) {
            // 含税金额计算
            excludedAmount = parseFloat(document.getElementById('excludedAmount').value) || 0;
            taxRate = parseFloat(document.getElementById('taxRate1').value) || 0;
            
            taxAmount = excludedAmount * (taxRate / 100);
            includedAmount = excludedAmount + taxAmount;
        } else if(calcType2.checked) {
            // 未税金额计算
            includedAmount = parseFloat(document.getElementById('includedAmount').value) || 0;
            taxRate = parseFloat(document.getElementById('taxRate2').value) || 0;
            
            excludedAmount = includedAmount / (1 + taxRate / 100);
            taxAmount = includedAmount - excludedAmount;
        } else if(calcType3.checked) {
            // 税率计算
            includedAmount = parseFloat(document.getElementById('includedAmountForRate').value) || 0;
            excludedAmount = parseFloat(document.getElementById('excludedAmountForRate').value) || 0;
            
            if(excludedAmount > 0 && includedAmount > excludedAmount) {
                taxAmount = includedAmount - excludedAmount;
                taxRate = (taxAmount / excludedAmount) * 100;
            }
        }
        
        // 显示结果
        document.getElementById('resultExcludedAmount').textContent = excludedAmount.toFixed(2);
        document.getElementById('resultTaxAmount').textContent = taxAmount.toFixed(2);
        document.getElementById('resultIncludedAmount').textContent = includedAmount.toFixed(2);
        document.getElementById('resultTaxRate').textContent = taxRate.toFixed(2);
        
        // 转换为中文大写
        document.getElementById('resultIncludedCapital').textContent = numberToChinese(includedAmount);
        document.getElementById('resultExcludedCapital').textContent = numberToChinese(excludedAmount);
        document.getElementById('resultTaxCapital').textContent = numberToChinese(taxAmount);
        document.getElementById('resultTaxRateCapital').textContent = taxRateToChinese(taxRate);
        
        // 显示结果容器
        resultContainer.style.display = 'block';
        
        // 为结果表格中的所有数据单元格添加点击复制功能
        setupCopyFunctionality();
    });
    
    // 复制表格按钮点击事件
    copyTableBtn.addEventListener('click', function() {
        // 获取表格元素
        const table = document.querySelector('#resultContainer table');
        if (!table) return;
        
        // 创建一个数组来存储表格内容
        let tableContent = [];
        
        // 获取表头
        const headerRow = table.querySelector('thead tr');
        if (headerRow) {
            const headerCells = headerRow.querySelectorAll('th');
            let headerTexts = [];
            headerCells.forEach(cell => {
                headerTexts.push(cell.textContent.trim());
            });
            tableContent.push(headerTexts.join('\t'));
        }
        
        // 获取表格内容
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            let rowTexts = [];
            cells.forEach(cell => {
                rowTexts.push(cell.textContent.trim());
            });
            tableContent.push(rowTexts.join('\t'));
        });
        
        // 将表格内容转换为文本
        const tableText = tableContent.join('\n');
        
        // 复制到剪贴板
        copyToClipboard(tableText);
        
        // 显示复制成功提示
        showCopyTooltip(this);
    });
    
    /**
     * 设置点击复制功能
     */
    function setupCopyFunctionality() {
        // 获取所有需要添加复制功能的元素
        const copyElements = [
            { id: 'resultIncludedAmount', prefix: '￥' },
            { id: 'resultExcludedAmount', prefix: '￥' },
            { id: 'resultTaxAmount', prefix: '￥' },
            { id: 'resultTaxRate', suffix: '%' },
            { id: 'resultIncludedCapital', prefix: '' },
            { id: 'resultExcludedCapital', prefix: '' },
            { id: 'resultTaxCapital', prefix: '' },
            { id: 'resultTaxRateCapital', prefix: '' }
        ];
        
        // 为每个元素添加点击事件
        copyElements.forEach(element => {
            const el = document.getElementById(element.id);
            if (el) {
                // 添加可复制的样式
                el.classList.add('copyable');
                
                // 添加点击事件
                el.addEventListener('click', function() {
                    // 获取要复制的文本
                    const textToCopy = (element.prefix || '') + this.textContent + (element.suffix || '');
                    
                    // 复制到剪贴板
                    copyToClipboard(textToCopy);
                    
                    // 显示复制成功提示
                    showCopyTooltip(this);
                });
            }
        });
        
        // 为表格单元格的父元素也添加点击事件（更好的用户体验）
        const resultRows = document.querySelectorAll('#resultContainer tbody tr');
        resultRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                cells[1].classList.add('copyable-cell');
                cells[1].addEventListener('click', function() {
                    const valueElement = this.querySelector('span');
                    if (valueElement) {
                        // 获取前缀（如￥）
                        const prefix = this.textContent.trim().startsWith('￥') ? '￥' : '';
                        // 获取后缀（如%）
                        const suffix = this.textContent.trim().endsWith('%') ? '%' : '';
                        
                        // 获取要复制的文本
                        const textToCopy = prefix + valueElement.textContent + suffix;
                        
                        // 复制到剪贴板
                        copyToClipboard(textToCopy);
                        
                        // 显示复制成功提示
                        showCopyTooltip(this);
                    }
                });
                
                cells[2].classList.add('copyable-cell');
                cells[2].addEventListener('click', function() {
                    // 获取要复制的文本
                    const textToCopy = this.textContent;
                    
                    // 复制到剪贴板
                    copyToClipboard(textToCopy);
                    
                    // 显示复制成功提示
                    showCopyTooltip(this);
                });
            }
        });
    }
    
    /**
     * 复制文本到剪贴板
     * @param {string} text - 要复制的文本
     */
    function copyToClipboard(text) {
        // 创建一个临时textarea元素
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        
        // 选择文本并复制
        textarea.select();
        document.execCommand('copy');
        
        // 移除临时元素
        document.body.removeChild(textarea);
    }
    
    /**
     * 显示复制成功提示
     * @param {HTMLElement} element - 触发复制的元素
     */
    function showCopyTooltip(element) {
        // 创建提示元素
        const tooltip = document.createElement('div');
        tooltip.className = 'copy-tooltip';
        tooltip.textContent = '已复制';
        
        // 设置提示样式
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '3px';
        tooltip.style.fontSize = '12px';
        tooltip.style.zIndex = '1000';
        
        // 添加到文档中
        document.body.appendChild(tooltip);
        
        // 计算位置
        const rect = element.getBoundingClientRect();
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
        tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
        
        // 显示提示
        tooltip.style.opacity = '1';
        
        // 设置淡出动画
        setTimeout(() => {
            tooltip.style.transition = 'opacity 0.5s';
            tooltip.style.opacity = '0';
            
            // 移除提示元素
            setTimeout(() => {
                document.body.removeChild(tooltip);
            }, 500);
        }, 1500);
    }
});

/**
 * 数字转中文大写
 * @param {number} num - 要转换的数字
 * @returns {string} - 中文大写结果
 */
function numberToChinese(num) {
    if (isNaN(num) || num === 0) return '零元整';
    
    // 将数字转为字符串，并分割整数和小数部分
    const parts = num.toFixed(2).toString().split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    // 中文数字
    const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    // 中文单位（个位到亿位）
    const cnIntUnits = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾'];
    // 中文小数单位
    const cnDecUnits = ['角', '分'];
    // 整数部分结果
    let integerResult = '';
    // 小数部分结果
    let decimalResult = '';
    
    // 处理整数部分
    const integerLength = integerPart.length;
    for (let i = 0; i < integerLength; i++) {
        const digit = parseInt(integerPart[i]);
        const unit = cnIntUnits[integerLength - 1 - i];
        
        if (digit !== 0) {
            integerResult += cnNums[digit] + unit;
        } else {
            // 处理连续的零
            if (i > 0 && parseInt(integerPart[i - 1]) !== 0) {
                integerResult += cnNums[digit];
            }
            // 处理万位和亿位
            if (unit === '万' || unit === '亿') {
                integerResult += unit;
            }
        }
    }
    
    // 处理小数部分
    for (let i = 0; i < 2; i++) {
        const digit = parseInt(decimalPart[i]);
        if (digit !== 0) {
            decimalResult += cnNums[digit] + cnDecUnits[i];
        }
    }
    
    // 组合结果
    let result = '';
    if (integerResult) {
        result += integerResult + '元';
    }
    
    if (decimalResult) {
        result += decimalResult;
    } else {
        result += '整';
    }
    
    return result;
}

/**
 * 税率转中文大写
 * @param {number} rate - 要转换的税率
 * @returns {string} - 中文大写结果
 */
function taxRateToChinese(rate) {
    if (isNaN(rate) || rate === 0) return '百分之零';
    
    // 将税率转为字符串，并分割整数和小数部分
    const parts = rate.toFixed(2).toString().split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    // 中文数字
    const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    
    // 处理整数部分
    let integerResult = '';
    for (let i = 0; i < integerPart.length; i++) {
        const digit = parseInt(integerPart[i]);
        if (integerPart.length === 1 || (i === 0 && digit !== 0)) {
            integerResult += cnNums[digit];
        } else if (digit !== 0) {
            if (i === 1) {
                integerResult += '拾' + cnNums[digit];
            } else {
                integerResult += cnNums[digit];
            }
        }
    }
    
    // 处理小数部分，只有当小数部分不是'00'时才显示
    let decimalResult = '';
    if (decimalPart !== '00') {
        if (decimalPart[0] !== '0') {
            decimalResult += '点' + cnNums[parseInt(decimalPart[0])];
        }
        if (decimalPart[1] !== '0') {
            decimalResult += cnNums[parseInt(decimalPart[1])];
        }
    }
    
    return '百分之' + integerResult + decimalResult;
}