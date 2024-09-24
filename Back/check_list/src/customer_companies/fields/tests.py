# import json
#
# from django.core.exceptions import ValidationError
# from rest_framework.reverse import reverse
# from rest_framework.test import APITestCase
#
# from customer_companies.customers.models import Customer
# from customer_companies.fields import views as field_views
# from customer_companies.fields.models import Field
# from customer_companies.fields.serializers import FieldSerializer
# from customer_companies.fields.service_logics import FieldFullGet
#
#
# class TestField(APITestCase):
#
#     def setUp(self) -> None:
#         self.customer = Customer.objects.create(name='Customer')
#         self.field_1_attributes = {'name': 'Field_1', 'customer': self.customer}
#         self.field_1 = Field.objects.create(**self.field_1_attributes)
#         self.field_2 = Field.objects.create(name='Field_2', customer=self.customer)
#         self.field_3 = Field.objects.create(name='Field_3', customer=self.customer)
#
#         self.serializer = FieldSerializer(instance=self.field_1_attributes)
#
#     def test_model_field_duplicate(self):
#         field = Field(name='Field_1', customer=self.customer)
#         with self.assertRaises(ValidationError):
#             field.full_clean()
#
#     def test_model_field_name_max_length(self):
#         field = Field.objects.get(id=self.field_1.pk)
#         max_length = field._meta.get_field('name').max_length
#         self.assertEquals(max_length, 120)
#
#     def test_model_field_customer(self):
#         field = Field.objects.get(id=self.field_1.pk)
#         self.assertEqual(self.customer, field.customer)
#
#         customer = Customer.objects.create(name='Customer_1')
#         field_check_customer = Field.objects.create(name='Field', customer=customer)
#         customer.delete()
#         with self.assertRaises(Field.DoesNotExist):
#             Field.objects.get(id=field_check_customer.pk)
#
#     def test_serializer_contains_expected_fields(self):
#         data = self.serializer.data
#
#         self.assertEqual(set(data.keys()), set(['name']))
#         self.assertEqual(data['name'], self.field_1_attributes['name'])
#
#     def test_field_view(self):
#         responce_get = self.client.get(reverse('customer_companies.fields:fields_customer',
#                                                kwargs={'pk_customer': self.customer.pk}))
#         fields = Field.objects.filter(customer=self.customer.pk).values()
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(list(fields), json.loads(json.dumps(responce_get.data)))
#         self.assertEqual(responce_get.resolver_match.func.__name__, field_views.FieldView.as_view().__name__)
#
#         data = {'name': 'Field_4', 'customer': self.customer}
#         responce_post = self.client.post(reverse('customer_companies.fields:fields_customer',
#                                                  kwargs={'pk_customer': self.customer.pk}), data)
#         self.assertEqual(201, responce_post.status_code)
#         field_create = Field.objects.get(name='Field_4')
#         field_post = Field(**data)
#         self.assertEqual(field_post.name, field_create.name)
#         self.assertEqual(field_post.customer, field_create.customer)
#         self.assertEqual(responce_post.resolver_match.func.__name__, field_views.FieldView.as_view().__name__)
#
#     def test_single_field_view(self):
#         responce_get = self.client.get(reverse('customer_companies.fields:single_field',
#                                                kwargs={'pk': self.field_1.pk}))
#         field = Field.objects.get(id=self.field_1.pk)
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(FieldSerializer(field).data, dict(responce_get.data))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          field_views.SingleFieldView.as_view().__name__)
#
#         field_create = Field.objects.create(name='Field_4', customer=self.customer)
#         data = {'name': 'Field', 'customer': self.customer.pk}
#         responce_put = self.client.put(reverse('customer_companies.fields:single_field',
#                                                kwargs={'pk': field_create.pk}), data)
#         self.assertEqual(200, responce_put.status_code)
#         self.assertNotEqual(FieldSerializer(field_create).data, dict(responce_put.data))
#         self.assertNotEqual(field_create.name, responce_get.data['name'])
#         self.assertEqual(responce_put.resolver_match.func.__name__,
#                          field_views.SingleFieldView.as_view().__name__)
#
#         responce_delete = self.client.delete(reverse('customer_companies.fields:single_field',
#                                                      kwargs={'pk': field_create.pk}))
#         self.assertEqual(204, responce_delete.status_code)
#         self.assertEqual(responce_delete.resolver_match.func.__name__,
#                          field_views.SingleFieldView.as_view().__name__)
#         with self.assertRaises(Field.DoesNotExist):
#             Field.objects.get(id=field_create.pk)
#
#     def test_customer_fields_view(self):
#         responce_get = self.client.get('/api/full_data_customers/')
#         self.assertEqual(200, responce_get.status_code)
#         for customer in responce_get.data:
#             customer_get = Customer.objects.get(id=customer['id'])
#             self.assertEqual(customer_get.name, customer['name'])
#             for field in customer['field']:
#                 field_get = Field.objects.get(id=field['id'])
#                 self.assertEqual(FieldSerializer(field_get).data, dict(field))
#
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          field_views.CustomerFieldsView.as_view().__name__)
#
#
#     def test_service(self):
#         service = FieldFullGet()
#         self.assertEqual(None, service.exception)
#         self.assertFalse(any(service.data))
#
#         field = Field.objects.create(name='Field', customer=self.customer)
#         field_pk = field.pk
#         service.field(field_pk)
#         data = service.data
#         data.update({'customer': self.customer.pk})
#         self.assertEqual(list(FieldSerializer(field).data.values()),
#                          list(data.values()))
#         self.assertEqual(field.customer.pk, service.customer)
#         field.delete()
#         service.field(field_pk)
#         self.assertEqual("Field Does Not Exist", service.exception)
