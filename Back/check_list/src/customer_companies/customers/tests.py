# import json
#
# from django.contrib.auth.models import Group, User
# from guardian.shortcuts import assign_perm
#
# from django.core.exceptions import ValidationError
# from rest_framework.reverse import reverse
# from rest_framework.test import APITestCase
#
# from customer_companies.customers.models import Customer
# from customer_companies.customers import views as customer_views
# from customer_companies.customers.serializers import CustomerSerializer
# from customer_companies.customers.service_logics import CustomerFullGet
#
#
# class TestCustomer(APITestCase):
#
#     def setUp(self) -> None:
#         self.customer_1_attributes = {'name': 'Customer_1'}
#         self.customer_1 = Customer.objects.create(**self.customer_1_attributes)
#         self.customer_2 = Customer.objects.create(name='Customer_2')
#         self.customer_3 = Customer.objects.create(name='Customer_3')
#
#         self.admin = User.objects.create_superuser('user', 'admin@example.com',
#                                                    'parol123')
#
#         self.serializer = CustomerSerializer(instance=self.customer_1_attributes)
#
#     def _login_superuser(self):
#         self.client.login(username='user', password='parol123')
#
#     def test_model_customer_duplicate(self):
#         customer = Customer(name='Customer_1')
#         with self.assertRaises(ValidationError):
#             customer.full_clean()
#
#     def test_model_customer_name_max_length(self):
#         customer = Customer.objects.get(id=self.customer_1.pk)
#         max_length = customer._meta.get_field('name').max_length
#         self.assertEquals(max_length, 120)
#
#     def test_serializer_contains_expected_fields(self):
#         data = self.serializer.data
#
#         self.assertEqual(set(data.keys()), {'name'})
#         self.assertEqual(data['name'], self.customer_1_attributes['name'])
#
#     def test_customer_view(self):
#         self._login_superuser()
#         responce_get = self.client.get('/api/customers/')
#         customers = Customer.objects.all().values()
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(list(customers), json.loads(json.dumps(responce_get.data)))
#         self.assertEqual(responce_get.resolver_match.func.__name__, customer_views.CustomerView.as_view().__name__)
#
#         data = {'name': 'Customer_4'}
#         responce_post = self.client.post('/api/customers/', data)
#         self.assertEqual(201, responce_post.status_code)
#         customer_create = Customer.objects.get(name='Customer_4')
#         customer_post = Customer(**data)
#         self.assertEqual(customer_post.name, customer_create.name)
#         self.assertEqual(responce_post.resolver_match.func.__name__, customer_views.CustomerView.as_view().__name__)
#
#     def test_single_customer_view(self):
#         self._login_superuser()
#         responce_get = self.client.get(reverse('customer_companies.customers:customer',
#                                                kwargs={'pk': self.customer_1.pk}))
#         customer = Customer.objects.get(id=self.customer_1.pk)
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(CustomerSerializer(customer).data, dict(responce_get.data))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          customer_views.SingleCustomerView.as_view().__name__)
#
#         customer_create = Customer.objects.create(name='Customer_4')
#         data = {'name': 'Customer'}
#         responce_put = self.client.put(reverse('customer_companies.customers:customer',
#                                                kwargs={'pk': customer_create.pk}), data)
#         self.assertEqual(200, responce_put.status_code)
#         self.assertNotEqual(CustomerSerializer(customer_create).data, dict(responce_get.data))
#         self.assertEqual(responce_put.resolver_match.func.__name__,
#                          customer_views.SingleCustomerView.as_view().__name__)
#
#         responce_delete = self.client.delete(reverse('customer_companies.customers:customer',
#                                                      kwargs={'pk': customer_create.pk}))
#         self.assertEqual(204, responce_delete.status_code)
#         self.assertEqual(responce_delete.resolver_match.func.__name__,
#                          customer_views.SingleCustomerView.as_view().__name__)
#         with self.assertRaises(Customer.DoesNotExist):
#             Customer.objects.get(id=customer_create.pk)
#
#     def test_service(self):
#         service = CustomerFullGet()
#         self.assertEqual(None, service.exception)
#         self.assertFalse(any(service.data))
#
#         customer = Customer.objects.create(name='Customer_4')
#         customer_pk = customer.pk
#         service.customer(customer_pk)
#         self.assertEqual(list(CustomerSerializer(customer).data.values()), list(service.data.values()))
#         customer.delete()
#         service.customer(customer_pk)
#         self.assertEqual("Customer Does Not Exist", service.exception)
#
#     def test_available(self):
#         some_group = Group.objects.create(name="User Group A")
#         assign_perm('change_customer', some_group, self.customer_1)
#
#         some_user = User.objects.create(username="User A")
#         some_user.groups.add(some_group)
#         available = some_user.has_perm('change_customer', self.customer_1)
#
#         self.assertEqual(True, available)
