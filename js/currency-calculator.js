// 汇率数据（示例数据，实际应用中应该从API获取实时汇率）
const exchangeRates = {
    'CNY': {
        'USD': 0.1385,
        'EUR': 0.1280,
        'GBP': 0.1095,
        'JPY': 20.7300
    },
    'USD': {
        'CNY': 7.2200,
        'EUR': 0.9250,
        'GBP': 0.7910,
        'JPY': 149.7000
    },
    'EUR': {
        'CNY': 7.8125,
        'USD': 1.0810,
        'GBP': 0.8550,
        'JPY': 161.8500
    },
    'GBP': {
        'CNY': 9.1324,
        'USD': 1.2640,
        'EUR': 1.1695,
        'JPY': 189.2500
    },
    'JPY': {
        'CNY': 0.0483,
        'USD': 0.0067,
        'EUR': 0.0062,
        'GBP': 0.0053
    }
};

// 添加货币符号映射
const currencySymbols = {
    'CNY': '¥',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥'
};

/**
 * 计算货币换算结果
 */
function calculateExchange() {
    const amount = parseFloat(document.getElementById('currencyAmount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    
    if (isNaN(amount) || amount <= 0) {
        alert('请输入有效的金额！');
        return;
    }
    
    if (fromCurrency === toCurrency) {
        alert('请选择不同的货币！');
        return;
    }
    
    // 获取汇率
    const rate = exchangeRates[fromCurrency][toCurrency];
    const result = amount * rate;
    
    // 生成结果
    const tbody = document.getElementById('exchangeResults');
    tbody.innerHTML = '';
    
    const row = tbody.insertRow();
    row.innerHTML = `
        <td>${getCurrencyName(fromCurrency)} ${currencySymbols[fromCurrency]}${amount.toFixed(2)}</td>
        <td>${getCurrencyName(toCurrency)}</td>
        <td>${rate.toFixed(4)}</td>
        <td>${currencySymbols[toCurrency]}${result.toFixed(2)}</td>
        <td>${convertToChinese(result)}</td>
    `;
    
    // 显示结果表格
    document.getElementById('exchangeResultTable').classList.remove('hidden');
}

/**
 * 清除换算结果
 */
function clearExchangeResult() {
    document.getElementById('currencyAmount').value = '1';
    document.getElementById('fromCurrency').selectedIndex = 0;
    document.getElementById('toCurrency').selectedIndex = 0;
    document.getElementById('exchangeResultTable').classList.add('hidden');
    document.getElementById('exchangeResults').innerHTML = '';
}

/**
 * 获取货币名称
 */
function getCurrencyName(code) {
    const names = {
        'CNY': '人民币',
        'USD': '美元',
        'EUR': '欧元',
        'GBP': '英镑',
        'JPY': '日元'
    };
    return names[code] || code;
}

/**
 * 互换货币位置
 */
function swapCurrencies() {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    
    // 保存当前选择的值
    const fromValue = fromCurrency.value;
    const toValue = toCurrency.value;
    
    // 互换值
    fromCurrency.value = toValue;
    toCurrency.value = fromValue;
    
    // 如果有输入金额，自动重新计算
    const amount = document.getElementById('currencyAmount').value;
    if (amount) {
        calculateExchange();
    }
} 