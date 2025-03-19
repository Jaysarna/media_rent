import frappe
from frappe import _

def rental_days(self,method):
    self.custom_rental_period_days = frappe.utils.date_diff(self.custom_end_date, self.custom_start_date)