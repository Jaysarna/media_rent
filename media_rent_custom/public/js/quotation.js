frappe.ui.form.on('Quotation', {
    validate: function(frm) {
        for (let row of frm.doc.items) {
            if (row.actual_qty < row.qty) {
                frappe.throw(__(`Insufficient quantity available for rental of item <b>${row.item_code}</b>. Please adjust the requested quantity.`));
            }
            if (!row.start_date || !row.end_date) {
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
                customer: frm.doc.party_name,
                date: frm.doc.transaction_date,
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
    start_date: function(frm, cdt, cdn) {
        calculate_qty(frm, cdt, cdn);
    },
    end_date: function(frm, cdt, cdn) {
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
    if (doc.start_date && doc.end_date) {
        var start_date = new Date(doc.start_date);
        var end_date = new Date(doc.end_date);
        var time_difference = end_date - start_date;
        var days_difference = time_difference / (1000 * 3600 * 24);

        frappe.model.set_value(cdt, cdn, 'rental_days', days_difference);
        frappe.model.set_value(cdt, cdn, 'amount', days_difference * doc.qty * doc.rate);

        frm.refresh_field('items');
    }
}
