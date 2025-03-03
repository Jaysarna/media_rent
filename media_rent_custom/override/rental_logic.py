import frappe
from frappe import _

def rental_days(self,method):
    self.custom_rental_period_days = frappe.utils.date_diff(self.custom_end_date, self.custom_start_date)

def serial_number_update(self,method):
    for item in self.items:
        if item.serial_and_batch_bundle:
            serial_and_batch_bundle = frappe.get_doc("Serial and Batch Bundle", item.serial_and_batch_bundle)
            for serial in serial_and_batch_bundle.entries:
                serial_doc = frappe.get_doc("Serial No", serial.serial_no)
                serial_doc.custom_customer = self.customer
                serial_doc.custom_start_date = item.custom_start_date
                serial_doc.custom_end_date = item.custom_end_date
                # serial_doc.custom_rental_days = int(item.custom_rental_days)
                # serial_doc.custom_touch_option = item.custom_touch_option
                # frappe.throw(serial_doc.custom_rental_days)
                serial_doc.save()


def change_total(self,method):
    for item in self.items:
        item.amount = item.qty * item.rate*item.custom_rental_days
        item.base_amount = item.qty * item.rate*item.custom_rental_days
        item.net_amount = item.qty * item.rate*item.custom_rental_days
        item.base_net_amount = item.qty * item.rate*item.custom_rental_days
    self.total = sum([item.amount for item in self.items])
    self.base_total = sum([item.base_amount for item in self.items])
    self.net_total = sum([item.net_amount for item in self.items])
    self.base_net_total = sum([item.base_net_amount for item in self.items])
    self.grand_total = self.total
    self.base_grand_total = self.base_total
    self.net_grand_total = self.net_total
    self.base_net_grand_total = self.base_net_total
    self.rounded_total = self.total
    if self.doctype == "Sales Invoice":
        self.outstanding_amount = self.rounded_total
