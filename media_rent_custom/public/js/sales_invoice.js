frappe.ui.form.on('Sales Invoice Item', {
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

        frm.doc.items.forEach(function(item) {
            frappe.model.set_value(item.doctype, item.name, 'custom_rental_days', days_difference);
        });

        frm.refresh_field('items');
    }
}