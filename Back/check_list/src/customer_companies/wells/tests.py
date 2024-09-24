# import json
#
# from django.core.exceptions import ValidationError
# from rest_framework.reverse import reverse
# from rest_framework.test import APITestCase
#
# from customer_companies.customers.models import Customer
# from customer_companies.wells import views as well_views
# from customer_companies.fields.models import Field
# from customer_companies.wells.models import Well
# from customer_companies.wells.serializers import WellSerializer
# from customer_companies.wells.service_logics import WellFullGet, WellFullPostServices
#
#
# class TestField(APITestCase):
#
#     def setUp(self) -> None:
#         self.customer = Customer.objects.create(name='Customer_1')
#         self.field = Field.objects.create(name='Field_1', customer=self.customer)
#         self.well_1_attributes = {'num_well': 'well_1', 'num_pad': 'num_1', 'well_type': 'Боковой горизонтальный ствол',
#                                   'field': self.field}
#         self.well_1 = Well.objects.create(**self.well_1_attributes)
#         lst = [
#             Well(num_well='well_2', num_pad='num_2', well_type='Боковой наклонно-направленный ствол', field=self.field),
#             Well(num_well='well_3', num_pad='num_3', well_type='Многоствольная скважина', field=self.field),
#         ]
#         Well.objects.bulk_create(lst)
#
#         self.serializer = WellSerializer(instance=self.well_1_attributes)
#
#     def test_model_field_duplicate(self):
#         well = Well(num_well='well_2', num_pad='num_2', well_type='Боковой наклонно-направленный ствол',
#                     field=self.field)
#         with self.assertRaises(ValidationError):
#             well.full_clean()
#
#     def test_model_field_max_length(self):
#         well = Well.objects.get(id=self.well_1.pk)
#         max_length = well._meta.get_field('num_well').max_length
#         self.assertEquals(max_length, 120)
#         max_length = well._meta.get_field('num_pad').max_length
#         self.assertEquals(max_length, 120)
#         max_length = well._meta.get_field('well_type').max_length
#         self.assertEquals(max_length, 120)
#
#     def test_model_well_field(self):
#         well = Well.objects.get(id=self.well_1.pk)
#         self.assertEqual(self.field, well.field)
#
#         field = Field.objects.create(name='Field', customer=self.customer)
#         well_check_customer = Well.objects.create(num_well='well', num_pad='num',
#                                                   well_type='Боковой наклонно-направленный ствол', field=field)
#         field.delete()
#         with self.assertRaises(Well.DoesNotExist):
#             Well.objects.get(id=well_check_customer.pk)
#
#     def test_serializer_contains_expected_fields(self):
#         data = self.serializer.data
#
#         self.assertEqual(set(data.keys()), set(['num_well', 'num_pad', 'well_type']))
#         self.assertEqual(data['num_well'], self.well_1_attributes['num_well'])
#         self.assertEqual(data['num_pad'], self.well_1_attributes['num_pad'])
#         self.assertEqual(data['well_type'], self.well_1_attributes['well_type'])
#
#     def test_well_view(self):
#         responce_get = self.client.get(reverse('customer_companies.wells:wells_field',
#                                                kwargs={'pk_field': self.field.pk}))
#         wells = Well.objects.filter(field=self.field.pk).values()
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(list(wells), json.loads(json.dumps(responce_get.data)))
#         self.assertEqual(responce_get.resolver_match.func.__name__, well_views.WellView.as_view().__name__)
#
#         data = {'num_well': 'well', 'num_pad': 'num', 'well_type': 'something',
#                 'field': self.field}
#         responce_post = self.client.post(reverse('customer_companies.wells:wells_field',
#                                                  kwargs={'pk_field': self.field.pk}), data)
#         self.assertEqual(responce_post.data['well_type'][0].code, 'invalid_choice')
#
#         data['well_type'] = 'Боковой наклонно-направленный ствол'
#         responce_post = self.client.post(reverse('customer_companies.wells:wells_field',
#                                                  kwargs={'pk_field': self.field.pk}), data)
#         self.assertEqual(201, responce_post.status_code)
#         well_create = Well.objects.get(num_well='well')
#         well_post = Well(id=well_create.pk, **data)
#         self.assertEqual(well_post, well_create)
#         self.assertEqual(well_post.field, well_create.field)
#         self.assertEqual(responce_post.resolver_match.func.__name__, well_views.WellView.as_view().__name__)
#
#     def test_single_well_view(self):
#         responce_get = self.client.get(reverse('customer_companies.wells:single_well',
#                                                kwargs={'pk': self.well_1.pk}))
#         well = Well.objects.get(id=self.well_1.pk)
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(WellSerializer(well).data, dict(responce_get.data))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          well_views.SingleWellView.as_view().__name__)
#
#         well_create = Well.objects.create(num_well='well', num_pad='num',
#                                           well_type='Боковой наклонно-направленный ствол', field=self.field)
#         data = {'num_well': 'well_no_well', 'num_pad': 'num', 'well_type': 'Боковой наклонно-направленный ствол',
#                 'field': self.field.pk}
#         responce_put = self.client.put(reverse('customer_companies.wells:single_well',
#                                                kwargs={'pk': well_create.pk}), data)
#         self.assertEqual(200, responce_put.status_code)
#         self.assertNotEqual(WellSerializer(well_create).data, dict(responce_put.data))
#         self.assertNotEqual(well_create.num_well, responce_get.data['num_well'])
#         self.assertEqual(responce_put.resolver_match.func.__name__,
#                          well_views.SingleWellView.as_view().__name__)
#
#         responce_delete = self.client.delete(reverse('customer_companies.wells:single_well',
#                                                      kwargs={'pk': well_create.pk}))
#         self.assertEqual(204, responce_delete.status_code)
#         self.assertEqual(responce_delete.resolver_match.func.__name__,
#                          well_views.SingleWellView.as_view().__name__)
#         with self.assertRaises(Well.DoesNotExist):
#             Well.objects.get(id=well_create.pk)
#
#     def test_service_well_full_get(self):
#         service = WellFullGet()
#         self.assertEqual(None, service.exception)
#         self.assertFalse(any(service.data))
#
#         well = Well.objects.create(num_well='well', num_pad='num',
#                                    well_type='Боковой наклонно-направленный ствол', field=self.field)
#         field_pk = well.pk
#         service.well(field_pk)
#         data = service.data
#         data.update({'id': well.pk, 'field': self.field.pk})
#         self.assertEqual(set(list(WellSerializer(well).data.values())),
#                          set(list(data.values())))
#         self.assertEqual(well.field.pk, service.field)
#         well.delete()
#         service.well(field_pk)
#         self.assertEqual("Well Does Not Exist", service.exception)
#
#     def test_service_well_full_post(self):
#         data = [None, 'num', 'well', 'Боковой наклонно-направленный ствол']
#         service = WellFullPostServices(data)
#
#         self.assertEqual(None, service.exception)
#         self.assertEqual(service.pk_field, data[0])
#         self.assertEqual(service.num_pad, data[1])
#         self.assertEqual(service.num_well, data[2])
#         self.assertEqual(service.well_type, data[3])
#
#         service.well()
#         self.assertEqual("Field Does Not Exist", service.exception)
#
#         service.pk_field = self.field.pk
#         well_create = service.well()
#         well_get = Well.objects.get(num_well='well')
#
#         self.assertEqual(well_create, well_get)
#
#         self.assertEqual(service.well(), well_get)
#
#         well_already_created = service.well()
#         well_get = Well.objects.get(id=well_create.pk)
#         self.assertEqual(well_already_created, well_get)
