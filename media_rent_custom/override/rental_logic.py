import frappe
from frappe import _

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