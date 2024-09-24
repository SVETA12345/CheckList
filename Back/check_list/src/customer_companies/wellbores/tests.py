# import json
#
# from django.core.exceptions import ValidationError
# from rest_framework.reverse import reverse
# from rest_framework.test import APITestCase
#
# from customer_companies.customers.models import Customer
# from .models import Wellbore
# from .serializers import WellboreSerializer
# from . import views as wellbore_views
# from customer_companies.fields.models import Field
# from .models import Well
# from .service_logics import WellboreFullGet, WellboreFullPostServices
#
#
# class TestField(APITestCase):
#
#     def setUp(self) -> None:
#         self.customer = Customer.objects.create(name='Customer_1')
#         self.field = Field.objects.create(name='Field_1', customer=self.customer)
#         self.well = Well.objects.create(num_well='Well_1', num_pad='num_1',
#                                         well_type='Боковой наклонно-направленный ствол', field=self.field)
#         self.wellbore_1_attributes = {"num_wellbore": "num_1", "pie_well": "Транспортный",
#                                       "diametr": 8.0, "well": self.well}
#         self.wellbore_1 = Wellbore.objects.create(**self.wellbore_1_attributes)
#         lst = [
#             Wellbore(num_wellbore="num_2", pie_well='Пилотный', diametr=6.0, well=self.well),
#             Wellbore(num_wellbore="num_3", pie_well='Горизонтальный', diametr=7.0, well=self.well),
#         ]
#         Wellbore.objects.bulk_create(lst)
#
#         self.serializer = WellboreSerializer(instance=self.wellbore_1_attributes)
#
#     def test_model_field_duplicate(self):
#         well = Wellbore(num_wellbore="num_1", pie_well='Пилотный', diametr=6.0, well=self.well)
#         with self.assertRaises(ValidationError):
#             well.full_clean()
#
#     def test_model_field_max_length(self):
#         wellbore = Wellbore.objects.get(id=self.wellbore_1.pk)
#         max_length = wellbore._meta.get_field('num_wellbore').max_length
#         self.assertEquals(max_length, 120)
#         max_length = wellbore._meta.get_field('pie_well').max_length
#         self.assertEquals(max_length, 120)
#
#     def test_model_wellbore_well(self):
#         wellbore = Wellbore.objects.get(id=self.wellbore_1.pk)
#         self.assertEqual(self.well, wellbore.well)
#
#         well = Well.objects.create(num_well='well', num_pad='num',
#                                    well_type='Боковой наклонно-направленный ствол', field=self.field)
#         wellbore_check_field = Wellbore.objects.create(num_wellbore="num", pie_well='Горизонтальный',
#                                                        diametr=7.0, well=well)
#         well.delete()
#         with self.assertRaises(Wellbore.DoesNotExist):
#             Wellbore.objects.get(id=wellbore_check_field.pk)
#
#     def test_serializer_contains_expected_fields(self):
#         data = self.serializer.data
#
#         self.assertEqual(set(data.keys()), set(['num_wellbore', 'pie_well', 'diametr']))
#         self.assertEqual(data['num_wellbore'], self.wellbore_1_attributes['num_wellbore'])
#         self.assertEqual(data['pie_well'], self.wellbore_1_attributes['pie_well'])
#         self.assertEqual(data['diametr'], self.wellbore_1_attributes['diametr'])
#
#     def test_well_view(self):
#         responce_get = self.client.get(reverse('customer_companies.wellbores:wellbores_well',
#                                                kwargs={'pk_well': self.well.pk}))
#         wellbores = Wellbore.objects.filter(well=self.well.pk).values()
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(list(wellbores), json.loads(json.dumps(responce_get.data)))
#         self.assertEqual(responce_get.resolver_match.func.__name__, wellbore_views.WellboreView.as_view().__name__)
#
#         data = {"num_wellbore": "num", "pie_well": "Транспортный", "diametr": 8.0, "well": self.well}
#         responce_post = self.client.post(reverse('customer_companies.wellbores:wellbores_well',
#                                                  kwargs={'pk_well': self.well.pk}), data)
#         self.assertEqual(201, responce_post.status_code)
#         wellbore_create = Wellbore.objects.get(num_wellbore='num')
#         wellbore_post = Wellbore(id=wellbore_create.pk, **data)
#         self.assertEqual(wellbore_post, wellbore_create)
#         self.assertEqual(wellbore_post.well, wellbore_create.well)
#         self.assertEqual(responce_post.resolver_match.func.__name__, wellbore_views.WellboreView.as_view().__name__)
#
#     def test_single_well_view(self):
#         responce_get = self.client.get(reverse('customer_companies.wellbores:single_wellbore',
#                                                kwargs={'pk': self.wellbore_1.pk}))
#         wellbore = Wellbore.objects.get(id=self.wellbore_1.pk)
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(WellboreSerializer(wellbore).data, dict(responce_get.data))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          wellbore_views.SingleWellboreView.as_view().__name__)
#
#         wellbore_create = Wellbore.objects.create(num_wellbore="num", pie_well='Горизонтальный', diametr=7.0, well=self.well)
#         data = {"num_wellbore": "some_num", "pie_well": "Транспортный", "diametr": 7.0, "well": self.well}
#         responce_put = self.client.put(reverse('customer_companies.wellbores:single_wellbore',
#                                                kwargs={'pk': wellbore_create.pk}), data)
#         self.assertEqual(200, responce_put.status_code)
#         self.assertNotEqual(WellboreSerializer(wellbore_create).data, dict(responce_put.data))
#         self.assertNotEqual(wellbore_create.num_wellbore, responce_get.data['num_wellbore'])
#         self.assertNotEqual(wellbore_create.pie_well, responce_get.data['pie_well'])
#         self.assertEqual(responce_put.resolver_match.func.__name__,
#                          wellbore_views.SingleWellboreView.as_view().__name__)
#
#         responce_delete = self.client.delete(reverse('customer_companies.wellbores:single_wellbore',
#                                                      kwargs={'pk': wellbore_create.pk}))
#         self.assertEqual(204, responce_delete.status_code)
#         self.assertEqual(responce_delete.resolver_match.func.__name__,
#                          wellbore_views.SingleWellboreView.as_view().__name__)
#         with self.assertRaises(Wellbore.DoesNotExist):
#             Wellbore.objects.get(id=wellbore_create.pk)
#
#     def test_service_wellbore_full_get(self):
#         service = WellboreFullGet()
#         self.assertEqual(None, service.exception)
#         self.assertFalse(any(service.data))
#
#         wellbore = Wellbore.objects.create(num_wellbore="num", pie_well='Горизонтальный', diametr=7.0, well=self.well)
#         well_pk = wellbore.pk
#         service.wellbore(well_pk)
#         data = service.data
#         del data['well_id']
#         del data['wellbore_id']
#         data.update({'id': wellbore.pk, 'well': self.well.pk})
#         self.assertEqual(set(list(WellboreSerializer(wellbore).data.values())),
#                          set(list(data.values())))
#         self.assertEqual(wellbore.well.pk, service.well)
#         wellbore.delete()
#         service.wellbore(well_pk)
#         self.assertEqual("Wellbore Does Not Exist", service.exception)
#
#     def service_well_full_post(self, service):
#         well = service.well()
#         self.assertEqual("Field Does Not Exist", service.exception)
#         self.assertEqual(None, well)
#
#         service.well_data[0] = self.field.pk
#         well_create_id = service.well()
#         well_create = Well.objects.get(id=well_create_id)
#         well_get = Well.objects.get(num_well='well')
#         self.assertEqual(well_create, well_get)
#
#         well_already_created = service.well()
#         self.assertEqual(well_already_created, well_create.pk)
#
#         well_create.delete()
#         service.well_data[0] = None
#
#     def service_wellbore_full_post(self, service):
#         wellbore = service.wellbore()
#         self.assertEqual("Well Does Not Exist", service.exception)
#         self.assertEqual(None, wellbore)
#
#         service.well_data[0] = self.field.pk
#
#         wellbore_create_id = service.wellbore()
#         wellbore_create = Wellbore.objects.get(id=wellbore_create_id)
#         wellbore_get = Wellbore.objects.get(num_wellbore='num')
#         self.assertEqual(wellbore_create, wellbore_get)
#
#         wellbore_already_created = service.wellbore()
#         self.assertEqual(wellbore_already_created, wellbore_create_id)
#
#     def test_service_full_post(self):
#         data = [None, 'num', 'well', 'Боковой наклонно-направленный ствол',
#                 'num', 'Транспортный', 7.0]
#         service = WellboreFullPostServices(data)
#
#         self.assertEqual(None, service.exception)
#         self.assertEqual(service.well_data, data[:4])
#
#         self.assertEqual(service.num_wellbore, data[4])
#         self.assertEqual(service.pie_well, data[5])
#         self.assertEqual(service.diametr, data[6])
#
#         self.service_well_full_post(service)
#         self.service_wellbore_full_post(service)
#
