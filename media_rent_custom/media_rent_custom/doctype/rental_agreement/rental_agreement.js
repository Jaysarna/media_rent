// Copyright (c) 2025, sarnajay and contributors
// For license information, please see license.txt

frappe.ui.form.on('Rental Agreement', {
    validate: function(frm) {
        for (let row of frm.doc.items) {
            if (!row.start_date || !row.end_date) {
                console.log("test")
                calculate_qty(frm, row.doctype, row.name);
            }
        }
    },
    refresh(frm){
        frm.add_custom_button(__('Create Sales Invoice'), function() {
            frappe.call({
                method: "media_rent_custom.media_rent_custom.doctype.rental_agreement.rental_agreement.create_sales_invoice",
                args: {
                    rental_agreement: frm.doc.name
                },
                callback: function(r) {
                    if (r.message) {
                        frappe.set_route("Form", "Sales Invoice", r.message);
                    }
                }
            });
        });
    }
});

frappe.ui.form.on('Rental Agreement Item', {
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
