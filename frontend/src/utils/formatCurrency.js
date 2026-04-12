// Fungsi menukar nombor ke format wang (Rupiah/RM)
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' }).format(amount);
};
