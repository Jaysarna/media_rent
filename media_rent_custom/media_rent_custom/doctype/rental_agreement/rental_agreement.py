# Copyright (c) 2025, sarnajay and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class RentalAgreement(Document):
	def validate(self):
		total_amount = 0
		total_qty = 0
		for item in self.items:
			total_amount = total_amount + item.amount
			total_qty = total_qty + item.qty

		self.amount = total_amount
		self.quantity = total_qty

	# def create_sales_invoice(self):
	# 	sales_invoice = frappe.new_doc("Sales Invoice")
	# 	# Set header details (adjust field names as necessary)
	# 	sales_invoice.customer = self.customer
	# 	sales_invoice.posting_date = self.posting_date if hasattr(self, "posting_date") else frappe.utils.today()
		
	# 	# Map items from this rental agreement to the sales invoice
	# 	for item in self.items:
	# 		sales_invoice.append("items", {
	# 			"item_code": item.item_code,
	# 			"qty": item.qty,
	# 			"rate": item.rate,
	# 			"amount": item.amount
	# 		})
		
	# 	sales_invoice.insert()
	# 	frappe.db.commit()
	# 	frappe.msgprint(f"Sales Invoice {sales_invoice.name} created successfully.")
	# 	return sales_invoice.name
		# for item in self.items:
		# 	if item.serial_and_batch_bundle:
		# 		# frappe.throw(f"{item.serial_and_batch_bundle}")
		# 		serial_and_batch_bundle = frappe.get_doc("Serial and Batch Bundle", item.serial_and_batch_bundle)
		# 		for serial in serial_and_batch_bundle.entries:
		# 			serial_doc = frappe.get_doc("Serial No", serial.serial_no)
		# 			serial_doc.custom_customer = self.customer
		# 			serial_doc.custom_start_date = item.custom_start_date
		# 			serial_doc.custom_end_date = item.custom_end_date
		# 			serial_doc.custom_touch_option = item.custom_touch_option 
		# 			# serial_doc.custom_rental_days = int(item.custom_rental_days)
		# 			# frappe.throw(serial_doc.custom_rental_days)
		# 			serial_doc.save()
