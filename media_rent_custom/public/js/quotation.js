frappe.ui.form.on('Quotation', {
    validate: function(frm) {
        for (let row of frm.doc.items) {
            if (!row.custom_start_date || !row.custom_end_date) {
                console.log("test")
                calculate_qty(frm, row.doctype, row.name);
            }
        }
    },
    refresh(frm){
        frm.add_custom_button(__('Create Rental Agreement'), function() {
            frm.route_options = {
                quotation: frm.doc.name
            };
            frappe.db.insert({
                doctype: 'Rental Agreement',
                customer: frm.doc.customer,
                date: frm.doc.date,
                // Sum quantities from all items
                quantity: frm.doc.items.reduce((total, item) => total + (item.qty || 0), 0),
                // Sum amounts from all items
                amount: frm.doc.items.reduce((total, item) => total + (item.amount || 0), 0),
                delivery_date: frm.doc.delivery_date,
                items: frm.doc.items
            }).then(doc => {
                console.log(doc);
                frappe.set_route("Form", "Rental Agreement", doc.name);
            });
        });
    }
});

frappe.ui.form.on('Quotation Item', {
    custom_start_date: function(frm, cdt, cdn) {
        calculate_qty(frm, cdt, cdn);
    },
    custom_end_date: function(frm, cdt, cdn) {
        calculate_qty(frm, cdt, cdn);
    },
    qty: function(frm, cdt, cdn) {
        calculate_qty(frm, cdt, cdn);
    },
    rate: function(frm, cdt, cdn) {
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
