const displayINRCurrency = (num) => {
    const formatter = new Intl.NumberFormat('en-DE', {
        style: "currency",
        currency: 'EUR',
        minimumFractionDigits: 2
    })

    return formatter.format(num)

}

export default displayINRCurrency