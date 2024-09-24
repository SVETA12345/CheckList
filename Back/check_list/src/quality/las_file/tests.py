# import json
#
# from django.core.exceptions import ValidationError
# from rest_framework.reverse import reverse
# from rest_framework.test import APITestCase
#
# from customer_companies.customers.models import Customer
# from customer_companies.fields.models import Field
# from customer_companies.wellbores.models import Wellbore
# from customer_companies.wells.models import Well
# from .models import Las_file
# from .serializers import Las_fileSerializer
# from . import views as las_file_views
# from .service_logics import Las_fileFullGet
# from ..quality_control.models import Quality_control
#
#
# class TestField(APITestCase):
#
#     def setUp(self) -> None:
#         customer = Customer.objects.create(name='Customer_1')
#         field = Field.objects.create(name='Field_1', customer=customer)
#         self.well = Well.objects.create(num_well='Well_1', num_pad='num_1',
#                                         well_type='', field=field)
#         wellbore_1 = Wellbore.objects.create(num_wellbore='num_1', pie_well='', diametr=None, well=self.well)
#         wellbore_2 = Wellbore.objects.create(num_wellbore='num_2', pie_well='', diametr=None, well=self.well)
#         self.wellbore_3 = Wellbore.objects.create(num_wellbore='num_3', pie_well='', diametr=None, well=self.well)
#         self.quality_control_1 = Quality_control.objects.create(value=1, density=1,section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                                 wellbore=wellbore_1)
#         self.quality_control_2 = Quality_control.objects.create(value=1, density=1,section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                                 wellbore=wellbore_2)
#
#         self.las_file_1_attributes = {'cap': '', 'parametres': '', 'mnemodescription': '', 'tabledata': '',
#                                       'las_file_count': 0, 'quality_control': self.quality_control_1}
#         self.las_file = Las_file.objects.create(**self.las_file_1_attributes)
#
#         Las_file.objects.create(cap='Частичная', parametres='', mnemodescription='', tabledata='', las_file_count=0,
#                                 quality_control=self.quality_control_2)
#
#         self.serializer_las_file = Las_fileSerializer(instance=self.las_file_1_attributes)
#
#     def test_model_field_duplicate(self):
#         las_file = Las_file(cap='Частичная', parametres='', mnemodescription='', tabledata='', las_file_count=0,
#                                 quality_control=self.quality_control_2)
#         with self.assertRaises(ValidationError):
#             las_file.full_clean()
#
#     def test_serializer_contains_expected_fields(self):
#         data = self.serializer_las_file.data
#         set_for_serializer = set(['cap', 'parametres', 'mnemodescription', 'tabledata', 'las_file_count'])
#         self.assertEqual(set(data.keys()), set_for_serializer)
#         for field_for_serializer in set_for_serializer:
#             self.field_for_serializer_full_inform(field_for_serializer, data)
#
#     def field_for_serializer_full_inform(self, field_for_serializer, data):
#         self.assertEqual(data[field_for_serializer], self.las_file_1_attributes[field_for_serializer])
#
#     def test_model_field_max_length(self):
#         las_file = Las_file.objects.get(quality_control=self.las_file.pk)
#         max_length = las_file._meta.get_field('cap').max_length
#         self.assertEquals(max_length, 120)
#         max_length = las_file._meta.get_field('parametres').max_length
#         self.assertEquals(max_length, 120)
#         max_length = las_file._meta.get_field('mnemodescription').max_length
#         self.assertEquals(max_length, 120)
#         max_length = las_file._meta.get_field('tabledata').max_length
#         self.assertEquals(max_length, 120)
#
#     def test_create_with_wrong_field(self):
#         quality_control = Quality_control.objects.create(value=1, density=1,section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                          wellbore=self.wellbore_3)
#         las_file = Las_file(cap='something', parametres='something', mnemodescription='something',
#                             tabledata='something', las_file_count=0,
#                             quality_control=quality_control)
#         with self.assertRaises(ValidationError):
#             las_file.full_clean()
#         quality_control.delete()
#
#     def test_model_las_file_quality_control(self):
#         las_file = Las_file.objects.get(quality_control=self.las_file.pk)
#         self.assertEqual(self.quality_control_1, las_file.quality_control)
#         self.assertEqual(self.quality_control_1.pk, las_file.pk)
#
#         quality_control = Quality_control.objects.create(value=1, density=1, section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                          wellbore=self.wellbore_3)
#         Las_file.objects.create(cap='', parametres='', mnemodescription='',
#                                 tabledata='', las_file_count=0,
#                                 quality_control=quality_control)
#         quality_control_id = quality_control.pk
#         quality_control.delete()
#         with self.assertRaises(Las_file.DoesNotExist):
#             Las_file.objects.get(quality_control=quality_control_id)
#
#     def test_las_file_create_view(self):
#         quality_control = Quality_control.objects.create(value=1, density=1, section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                          wellbore=self.wellbore_3)
#         data = {'cap': '', 'parametres': '', 'mnemodescription': '', 'tabledata': '', 'las_file_count': 0}
#         responce_post = self.client.post(reverse('quality.las_file:las_file_create_view',
#                                                  kwargs={'pk_quality_control': quality_control.pk}), data)
#         las_file = Las_file.objects.get(quality_control=quality_control.pk)
#         self.assertEqual(201, responce_post.status_code)
#         self.assertEqual(Las_fileSerializer(las_file).data, json.loads(json.dumps(responce_post.data)))
#         self.assertEqual(responce_post.resolver_match.func.__name__,
#                          las_file_views.Las_fileCreateView.as_view().__name__)
#
#     def test_customer_list_view(self):
#         responce_get = self.client.get('/api/las_file/')
#         las_file = Las_file.objects.all().values()
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(list(las_file), list(responce_get.data))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          las_file_views.Las_fileView.as_view().__name__)
#
#     def test_single_customer_view(self):
#         responce_get = self.client.get(reverse('quality.las_file:single_las_file_view',
#                                                kwargs={'pk': self.quality_control_1.pk}))
#         las_file = Las_file.objects.get(quality_control=self.quality_control_1.pk)
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(Las_fileSerializer(las_file).data, dict(responce_get.data))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          las_file_views.SingleLas_fileView.as_view().__name__)
#
#         quality_control = Quality_control.objects.create(value=1, density=1, section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                          wellbore=self.wellbore_3)
#         las_file = Las_file.objects.create(cap='', parametres='', mnemodescription='', tabledata='', las_file_count=0,
#                                            quality_control=quality_control)
#         data = {'cap': 'Полная', 'parametres': 'Полная', 'mnemodescription': 'Полная', 'tabledata': 'Полная',
#                 'las_file_count': 30, 'quality_control': quality_control}
#         responce_put = self.client.put(reverse('quality.las_file:single_las_file_view',
#                                                kwargs={'pk': las_file.pk}), data)
#         self.assertEqual(200, responce_put.status_code)
#         self.assertNotEqual(Las_fileSerializer(las_file).data, dict(responce_put.data))
#         self.assertEqual(responce_put.resolver_match.func.__name__,
#                          las_file_views.SingleLas_fileView.as_view().__name__)
#
#         responce_delete = self.client.delete(reverse('quality.las_file:single_las_file_view',
#                                                      kwargs={'pk': las_file.pk}))
#         self.assertEqual(204, responce_delete.status_code)
#         self.assertEqual(responce_delete.resolver_match.func.__name__,
#                          las_file_views.SingleLas_fileView.as_view().__name__)
#         with self.assertRaises(Las_file.DoesNotExist):
#             Las_file.objects.get(quality_control=las_file.pk)
#         quality_control.delete()
#
#     def service_get(self, service_logic):
#         service_logic.las_file(self.las_file.pk)
#         las_file_dict = Las_fileSerializer(self.las_file).data
#         del las_file_dict['quality_control_id']
#         data = {'las_file': las_file_dict}
#         self.assertEqual(data, service_logic.data)
#
#         service_logic.las_file(None)
#         self.assertEqual("Las file Does Not Exist", service_logic.exception)
#
#     def test_service(self):
#         service_logic = Las_fileFullGet()
#         self.assertEqual(None, service_logic.exception)
#         self.assertFalse(any(service_logic.data))
#
#         self.service_get(service_logic)
#
#         quality_control = Quality_control.objects.create(value=1, density=1, section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                          wellbore=self.wellbore_3)
#         data = {'cap': 'Полная', 'parametres': 'Полная', 'mnemodescription': 'Полная', 'tabledata': 'Полная',
#                 'las_file_count': 30}
#         service_logic.post_las_file(data, quality_control.pk)
#
#         data.update({'quality_control_id': quality_control.pk})
#         self.assertEqual(data, Las_fileSerializer(Las_file.objects.get(quality_control=quality_control.pk)).data)
