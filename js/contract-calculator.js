/**
 * 初始化合同计算器
 */
function initContractCalculator() {
    // 绑定计算按钮事件
    document.querySelector('#contract-calculator button[onclick="calculateContractPayments()"]')
        .addEventListener('click', calculateContractPayments);
    
    // 绑定清除按钮事件
    document.querySelector('#contract-calculator button.clear-btn')
        .addEventListener('click', clearContractResult);
    
    // 监听付款次数变化
    document.getElementById('paymentCount').addEventListener('change', function() {
        initPaymentRatios(parseInt(this.value));
    });
    
    // 添加合同总金额变化监听
    document.getElementById('totalAmount').addEventListener('input', saveContractAmount);
}

/**
 * 保存合同总金额到 sessionStorage
 */
function saveContractAmount() {
    const amount = document.getElementById('totalAmount').value;
    if (amount) {
        sessionStorage.setItem('contractAmount', amount);
    }
}

/**
 * 从 sessionStorage 恢复合同总金额
 */
function restoreContractAmount() {
    const amount = sessionStorage.getItem('contractAmount');
    if (amount) {
        document.getElementById('totalAmount').value = amount;
    }
}

/**
 * 初始化合同总金额保存事件
 */
function initContractAmountSave() {
    document.getElementById('totalAmount').addEventListener('input', saveContractAmount);
}

/**
 * 初始化付款比例输入框
 * @param {number} count - 付款次数
 */
function initPaymentRatios(count) {
    const container = document.getElementById('ratioInputs');
    container.innerHTML = ''; // 清空现有输入框
    
    // 默认比例设置
    const defaultRatios = [40, 50, 10];
    let remainingRatio = 100;
    
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'ratio-input-group';
        
        const label = document.createElement('label');
        label.textContent = `第${i + 1}期付款比例(%):`;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.max = '100';
        input.step = '0.01';
        input.className = 'ratio-input';
        // 设置默认值
        input.value = i < defaultRatios.length ? defaultRatios[i] : 0;
        
        // 添加输入事件监听
        input.addEventListener('input', function() {
            updateRatios(this);
        });
        
        div.appendChild(label);
        div.appendChild(input);
        container.appendChild(div);
    }
}

/**
 * 更新付款比例
 * @param {HTMLInputElement} changedInput - 被修改的输入框
 */
function updateRatios(changedInput) {
    const inputs = document.querySelectorAll('.ratio-input');
    const inputsArray = Array.from(inputs);
    const lastInput = inputs[inputs.length - 1];
    
    // 如果修改的不是最后一个输入框
    if (changedInput !== lastInput) {
        let total = 0;
        // 计算除最后一个以外的所有比例之和
        inputsArray.forEach((input, index) => {
            if (index !== inputs.length - 1) {
                total += parseFloat(input.value || 0);
            }
        });
        
        // 设置最后一个输入框的值为剩余比例
        const remaining = Math.max(0, 100 - total);
        lastInput.value = remaining.toFixed(2);
    }
    
    // 验证总和是否等于100%
    let total = 0;
    inputsArray.forEach(input => {
        total += parseFloat(input.value || 0);
    });
    
    // 如果总和不等于100%，显示警告
    const warningElement = document.getElementById('ratioWarning') || createWarningElement();
    if (Math.abs(total - 100) > 0.01) {
        warningElement.textContent = `警告：当前付款比例总和为${total.toFixed(2)}%，应等于100%`;
        warningElement.style.display = 'block';
    } else {
        warningElement.style.display = 'none';
    }
}

/**
 * 创建警告提示元素
 */
function createWarningElement() {
    const warning = document.createElement('div');
    warning.id = 'ratioWarning';
    warning.style.color = 'red';
    warning.style.marginTop = '10px';
    document.getElementById('ratioInputs').appendChild(warning);
    return warning;
}

/**
 * 更新比例输入框
 */
function updateRatioInputs() {
    const count = parseInt(document.getElementById('paymentCount').value) || 3;
    const container = document.getElementById('ratioInputs');
    container.innerHTML = '';
    
    for (let i = 1; i <= count; i++) {
        const div = document.createElement('div');
        div.className = 'ratio-input';
        div.innerHTML = `
            <label for="ratio${i}">第${i}期比例(%)：</label>
            <input type="number" id="ratio${i}" min="0" max="100" step="1" value="${i === count ? '' : '30'}">
        `;
        container.appendChild(div);
    }
}

/**
 * 计算合同付款
 */
function calculateContractPayments() {
    const totalAmount = parseFloat(document.getElementById('totalAmount').value);
    const taxRate = parseFloat(document.getElementById('contractTaxRate').value);
    
    if (isNaN(totalAmount) || totalAmount <= 0) {
        alert('请输入有效的合同金额！');
        return;
    }
    
    if (isNaN(taxRate) || taxRate < 0) {
        alert('请输入有效的税率！');
        return;
    }
    
    // 获取付款比例
    const ratioInputs = document.querySelectorAll('.ratio-input');
    const ratios = Array.from(ratioInputs).map(input => parseFloat(input.value) || 0);
    
    // 验证比例总和
    const totalRatio = ratios.reduce((sum, ratio) => sum + ratio, 0);
    if (Math.abs(totalRatio - 100) > 0.01) {
        // 如果所有输入框都为空或0，不显示警告
        const allEmpty = ratios.every(ratio => ratio === 0);
        if (!allEmpty) {
            alert('付款比例之和必须等于100%！');
            return;
        }
    }
    
    // 计算含税和未税金额
    const withoutTaxAmount = totalAmount / (1 + taxRate/100);
    const taxAmount = totalAmount - withoutTaxAmount;
    
    // 生成结果
    const tbody = document.getElementById('paymentResults');
    tbody.innerHTML = '';
    
    // 添加合同总额信息
    const totalRow = tbody.insertRow();
    totalRow.innerHTML = `
        <td>合同总额</td>
        <td>100%</td>
        <td>¥${totalAmount.toFixed(2)}</td>
        <td>¥${taxAmount.toFixed(2)}</td>
        <td>¥${withoutTaxAmount.toFixed(2)}</td>
        <td>${convertToChinese(totalAmount)}</td>
    `;
    
    // 添加各期付款信息
    ratios.forEach((ratio, index) => {
        const amount = (totalAmount * ratio / 100);
        const periodTax = amount - (amount / (1 + taxRate/100));
        const periodWithoutTax = amount - periodTax;
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>第${index + 1}期付款</td>
            <td>${ratio}%</td>
            <td>¥${amount.toFixed(2)}</td>
            <td>¥${periodTax.toFixed(2)}</td>
            <td>¥${periodWithoutTax.toFixed(2)}</td>
            <td>${convertToChinese(amount)}</td>
        `;
    });
    
    // 显示结果表格
    document.getElementById('contractResultTable').classList.remove('hidden');
    
    // 为新生成的表格添加复制功能
    const allCells = tbody.querySelectorAll('td');
    allCells.forEach(cell => {
        cell.style.cursor = 'pointer';
        cell.title = '点击复制';
        cell.addEventListener('click', () => {
            const isRate = cell.parentElement.firstElementChild.textContent === '税率';
            const isChinese = cell.cellIndex === 5; // 第6列是大写金额
            const text = cell.textContent;
            let copyText;
            
            // 处理不同类型的内容
            if (text.includes('%')) {
                copyText = text; // 百分比直接复制
            } else if (isChinese) {
                copyText = text; // 大写金额直接复制
            } else if (text.startsWith('第') || text === '合同总额') {
                copyText = text; // 标题直接复制
            } else if (!text.startsWith('¥')) {
                copyText = `¥${text}`; // 添加人民币符号
            } else {
                copyText = text; // 其他情况直接复制
            }
            
            copyToClipboard(copyText);
            
            // 创建并显示"已复制"提示
            const tooltip = document.createElement('div');
            tooltip.textContent = '已复制';
            tooltip.style.cssText = `
                position: fixed;
                background: rgba(33, 150, 243, 0.9);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                pointer-events: none;
                z-index: 1000;
            `;
            
            // 计算提示框位置
            const rect = cell.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - 20 + 'px';
            tooltip.style.top = rect.top - 25 + 'px';
            
            document.body.appendChild(tooltip);
            
            // 显示复制成功的视觉反馈
            const originalBg = cell.style.backgroundColor;
            const originalColor = cell.style.color;
            cell.style.backgroundColor = '#2196F3'; // 使用蓝色
            cell.style.color = 'white';
            
            // 200ms后恢复单元格样式，500ms后移除提示框
            setTimeout(() => {
                cell.style.backgroundColor = originalBg;
                cell.style.color = originalColor;
            }, 200);
            
            setTimeout(() => {
                tooltip.style.opacity = '0';
                tooltip.style.transition = 'opacity 0.2s';
                setTimeout(() => document.body.removeChild(tooltip), 200);
            }, 500);
        });
    });
}

/**
 * 清除合同计算结果
 */
function clearContractResult() {
    // 清除输入值
    document.getElementById('totalAmount').value = '';
    document.getElementById('contractTaxRate').value = '6';
    document.getElementById('paymentCount').value = '3';
    
    // 清除 sessionStorage 中的合同总金额
    sessionStorage.removeItem('contractAmount');
    
    // 重置付款比例为默认值
    initPaymentRatios(3); // 使用默认的3期付款，比例为40%、50%、10%
    
    // 隐藏结果表格
    const resultTable = document.getElementById('contractResultTable');
    resultTable.classList.add('hidden');
    resultTable.previousElementSibling?.classList?.add('hidden');
}

/**
 * 初始化导航事件
 */
function initNavigationEvents() {
    document.querySelectorAll('.nav-item a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // 更新导航状态
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            
            // 切换计算器显示
            document.querySelectorAll('.calculator-container').forEach(container => {
                container.classList.add('hidden');
            });
            document.getElementById(targetId).classList.remove('hidden');
        });
    });
}

/**
 * 复制表格全部内容
 */
function copyTableContent() {
    const table = document.getElementById('contractResultTable');
    const thead = table.getElementsByTagName('thead')[0];
    const tbody = document.getElementById('paymentResults');
    let text = '';
    
    // 添加表头
    const headers = thead.getElementsByTagName('th');
    const headerTexts = [];
    for (let i = 0; i < headers.length; i++) {
        headerTexts.push(headers[i].textContent);
    }
    text += headerTexts.join('\t') + '\n';
    
    // 添加分隔线
    text += headerTexts.map(() => '-'.repeat(20)).join('\t') + '\n';
    
    // 获取所有行
    const rows = tbody.getElementsByTagName('tr');
    
    // 遍历每一行
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const cellTexts = [];
        
        // 跳过分割线
        if (cells[0].getAttribute('colspan')) {
            continue;
        }
        
        // 遍历每个单元格
        for (let j = 0; j < cells.length; j++) {
            const cell = cells[j];
            // 如果单元格跨列，跳过
            if (cell.getAttribute('colspan')) {
                cellTexts.push('-');
                continue;
            }
            // 处理不同类型的内容
            const text = cell.textContent;
            if (text.includes('%')) {
                cellTexts.push(text);
            } else if (j === cells.length - 1) {  // 最后一列是大写金额
                cellTexts.push(text);
            } else if (!text.startsWith('¥') && !text.includes('税率') && !isNaN(text)) {
                cellTexts.push(`¥${text}`);
            } else {
                cellTexts.push(text);
            }
        }
        
        // 将单元格文本组合成一行，使用制表符分隔
        text += cellTexts.join('\t') + '\n';
    }
    
    // 复制到剪贴板
    copyToClipboard(text);
}

/**
 * 复制表格文本内容
 */
function copyTableTextContent() {
    const tbody = document.getElementById('paymentResults');
    let text = '';
    
    // 获取所有行
    const rows = tbody.getElementsByTagName('tr');
    
    // 遍历每一行
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        
        // 跳过分割线
        if (cells[0].getAttribute('colspan')) {
            continue;
        }
        
        // 获取所有列的内容
        const stage = cells[0].textContent;
        const ratio = cells[1].textContent;
        const amount = cells[2] ? cells[2].textContent : '';
        const tax = cells[3] ? cells[3].textContent : '';
        const withoutTax = cells[4] ? cells[4].textContent : '';
        const chinese = cells[5] ? cells[5].textContent : '';
        
        // 如果是合同总额行
        if (stage === '合同总额') {
            text += `${stage}：${amount}（${chinese}）\n`;
            // 获取税率
            const taxRate = document.getElementById('contractTaxRate').value;
            text += `税率：${taxRate}%\n`;
            text += `税额：${tax}\n`;
            text += `未税金额：${withoutTax}\n\n`;
            continue;
        }
        
        // 付款信息
        if (stage.includes('期付款')) {
            text += `${stage}：${amount}（${chinese}）\n`;
            text += `付款比例：${ratio}\n`;
            text += `  税额：${tax}\n`;
            text += `  未税金额：${withoutTax}\n`;
            if (i < rows.length - 1) {
                text += '\n'; // 在每期付款信息之间添加空行，除了最后一期
            }
        }
    }
    
    // 复制到剪贴板并显示复制成功提示
    copyToClipboard(text.trim());
    
    // 创建并显示"已复制"提示
    const button = document.querySelector('.copy-btn');
    const tooltip = document.createElement('div');
    tooltip.textContent = '已复制';
    tooltip.style.cssText = `
        position: fixed;
        background: rgba(33, 150, 243, 0.9);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        pointer-events: none;
        z-index: 1000;
    `;
    
    // 计算提示框位置
    const rect = button.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - 20 + 'px';
    tooltip.style.top = rect.top - 25 + 'px';
    
    document.body.appendChild(tooltip);
    
    // 显示复制成功的视觉反馈
    button.style.backgroundColor = '#2196F3';
    
    // 200ms后恢复按钮样式，500ms后移除提示框
    setTimeout(() => {
        button.style.backgroundColor = '';
    }, 200);
    
    setTimeout(() => {
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.2s';
        setTimeout(() => document.body.removeChild(tooltip), 200);
    }, 500);
}

/**
 * 复制内容到剪贴板
 * @param {string} text - 要复制的文本
 */
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        // 可以添加一个提示，比如：
        console.log('复制成功：', text);
    } catch (err) {
        console.error('复制失败:', err);
    }
    
    document.body.removeChild(textarea);
}

// 修改页面加载初始化部分
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航功能
    initNavigationEvents();
    
    // 初始化合同计算器
    initContractCalculator();
    
    // 初始化默认3期付款
    const defaultCount = 3;
    document.getElementById('paymentCount').value = defaultCount;
    initPaymentRatios(defaultCount);
    
    // 恢复上次输入的合同总金额
    restoreContractAmount();
    
    // 初始化复制功能
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
}); 