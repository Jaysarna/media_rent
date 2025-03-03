frappe.ui.form.on('Quotation', {
    validate: function(frm) {
        for (let row of frm.doc.items) {
            if (!row.custom_start_date || !row.custom_end_date) {
                console.log("test")
                calculate_qty(frm, row.doctype, row.name);
            }
        }
    }
});

frappe.ui.form.on('Quotation Item', {
    custom_start_date: function(frm, cdt, cdn) {
        calculate_qty(frm, cdt, cdn);
    },
    custom_end_date: function(frm, cdt, cdn) {
        calculate_qty(frm, cdt, cdn);
    }
});

function calculate_qty(frm, cdt, cdn) {
    var doc = locals[cdt][cdn];
    if (doc.custom_start_date && doc.custom_end_date) {
        var start_date = new Date(doc.custom_start_date);
        var end_date = new Date(doc.custom_end_date);
        var time_difference = end_date - start_date;
        var days_difference = time_difference / (1000 * 3600 * 24);

        frappe.model.set_value(cdt, cdn, 'custom_rental_days', days_difference);
        frappe.model.set_value(cdt, cdn, 'amount', days_difference * doc.qty * doc.rate);

        frm.refresh_field('items');
    }
}
