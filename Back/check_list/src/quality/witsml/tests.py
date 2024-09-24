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
# from .models import Witsml
# from .serializers import WitsmlSerializer
# from . import views as witsml_views
# from .service_logics import WitsmlFullGet
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
#         self.quality_control_1 = Quality_control.objects.create(value=1, density=1, section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                                 wellbore=wellbore_1)
#         self.quality_control_2 = Quality_control.objects.create(value=1, density=1, section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                                 wellbore=wellbore_2)
#         # self.quality_control_3 = Quality_control.objects.create(value=1, density=1,
#         #                                                         wellbore=wellbore_3)
#
#         self.witsml_1_attributes = {'curvenames': '', 'mnemodescription': '', 'fullness_data': '',
#                                     'witsml_count': 0, 'quality_control': self.quality_control_1}
#         self.witsml = Witsml.objects.create(**self.witsml_1_attributes)
#
#         Witsml.objects.create(curvenames='Частичная', mnemodescription='', fullness_data='', witsml_count=0,
#                               quality_control=self.quality_control_2)
#
#         self.serializer_witsml = WitsmlSerializer(instance=self.witsml_1_attributes)
#
#     def test_model_field_duplicate(self):
#         witsml = Witsml(curvenames='', mnemodescription='Частичная', fullness_data='', witsml_count=0,
#                         quality_control=self.quality_control_1)
#         with self.assertRaises(ValidationError):
#             witsml.full_clean()
#
#     def test_serializer_contains_expected_fields(self):
#         data = self.serializer_witsml.data
#         set_for_serializer = set(['curvenames', 'mnemodescription', 'fullness_data', 'witsml_count'])
#         self.assertEqual(set(data.keys()), set_for_serializer)
#
#         for field_for_serializer in set_for_serializer:
#             self.field_for_serializer_full_inform(field_for_serializer, data)
#
#     def field_for_serializer_full_inform(self, field_for_serializer, data):
#         self.assertEqual(data[field_for_serializer], self.witsml_1_attributes[field_for_serializer])
#
#     def test_model_field_max_length(self):
#         witsml = Witsml.objects.get(quality_control=self.witsml.pk)
#         max_length = witsml._meta.get_field('curvenames').max_length
#         self.assertEquals(max_length, 120)
#         max_length = witsml._meta.get_field('mnemodescription').max_length
#         self.assertEquals(max_length, 120)
#         max_length = witsml._meta.get_field('fullness_data').max_length
#         self.assertEquals(max_length, 120)
#
#     def test_create_with_wrong_field(self):
#         quality_control = Quality_control.objects.create(value=1, density=1,section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                          wellbore=self.wellbore_3)
#         witsml = Witsml(curvenames='something', mnemodescription='something',
#                         fullness_data='something', witsml_count=None,
#                         quality_control=quality_control)
#         with self.assertRaises(ValidationError):
#             witsml.full_clean()
#         quality_control.delete()
#
#     def test_model_witsml_quality_control(self):
#         witsml = Witsml.objects.get(quality_control=self.witsml.pk)
#         self.assertEqual(self.quality_control_1, witsml.quality_control)
#         self.assertEqual(self.quality_control_1.pk, witsml.pk)
#
#         quality_control = Quality_control.objects.create(value=1, density=1,section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                          wellbore=self.wellbore_3)
#         Witsml.objects.create(curvenames='', mnemodescription='', fullness_data='', witsml_count=0,
#                               quality_control=quality_control)
#         quality_control_id = quality_control.pk
#         quality_control.delete()
#         with self.assertRaises(Witsml.DoesNotExist):
#             Witsml.objects.get(quality_control=quality_control_id)
#
#     def test_witsml_create_view(self):
#         quality_control = Quality_control.objects.create(value=1, density=1, section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                          wellbore=self.wellbore_3)
#         data = {'curvenames': '', 'mnemodescription': '', 'fullness_data': '',
#                 'witsml_count': 0}
#         responce_post = self.client.post(reverse('quality.witsml:witsml_create_view',
#                                                  kwargs={'pk_quality_control': quality_control.pk}), data)
#         witsml = Witsml.objects.get(quality_control=quality_control.pk)
#         self.assertEqual(201, responce_post.status_code)
#         self.assertEqual(WitsmlSerializer(witsml).data, json.loads(json.dumps(responce_post.data)))
#         self.assertEqual(responce_post.resolver_match.func.__name__, witsml_views.WitsmlCreateView.as_view().__name__)
#
#     def test_witsml_list_view(self):
#         responce_get = self.client.get('/api/witsml/')
#         witsml = Witsml.objects.all().values()
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(list(witsml), list(responce_get.data))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          witsml_views.WitsmlView.as_view().__name__)
#
#     def test_single_witsml_view(self):
#         responce_get = self.client.get(reverse('quality.witsml:single_witsml_view',
#                                                kwargs={'pk': self.quality_control_1.pk}))
#         witsml = Witsml.objects.get(quality_control=self.quality_control_1.pk)
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(WitsmlSerializer(witsml).data, dict(responce_get.data))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          witsml_views.SingleWitsmlView.as_view().__name__)
#
#         quality_control = Quality_control.objects.create(value=1, density=1, section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                          wellbore=self.wellbore_3)
#         witsml = Witsml.objects.create(curvenames='', mnemodescription='', fullness_data='', witsml_count=0,
#                                        quality_control=quality_control)
#         data = {'curvenames': 'Полная', 'mnemodescription': 'Полная', 'fullness_data': 'Полная', 'witsml_count': 50,
#                 'quality_control': quality_control}
#         responce_put = self.client.put(reverse('quality.witsml:single_witsml_view',
#                                                kwargs={'pk': witsml.pk}), data)
#         self.assertEqual(200, responce_put.status_code)
#         self.assertNotEqual(WitsmlSerializer(witsml).data, dict(responce_put.data))
#         self.assertEqual(responce_put.resolver_match.func.__name__,
#                          witsml_views.SingleWitsmlView.as_view().__name__)
#
#         responce_delete = self.client.delete(reverse('quality.witsml:single_witsml_view',
#                                                      kwargs={'pk': witsml.pk}))
#         self.assertEqual(204, responce_delete.status_code)
#         self.assertEqual(responce_delete.resolver_match.func.__name__,
#                          witsml_views.SingleWitsmlView.as_view().__name__)
#         with self.assertRaises(Witsml.DoesNotExist):
#             Witsml.objects.get(quality_control=witsml.pk)
#         quality_control.delete()
#
#     def service_get(self, service_logic):
#         service_logic.witsml(self.witsml.pk)
#         witsml_dict = WitsmlSerializer(self.witsml).data
#         del witsml_dict['quality_control_id']
#         data = {'witsml': witsml_dict}
#         self.assertEqual(data, service_logic.data)
#
#         service_logic.witsml(None)
#         self.assertEqual("Witsml Does Not Exist", service_logic.exception)
#
#     def test_service(self):
#         service_logic = WitsmlFullGet()
#         self.assertEqual(None, service_logic.exception)
#         self.assertFalse(any(service_logic.data))
#
#         self.service_get(service_logic)
#
#         quality_control = Quality_control.objects.create(value=1, density=1,section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                          wellbore=self.wellbore_3)
#         data = {'curvenames': '', 'mnemodescription': '', 'fullness_data': '', 'witsml_count': 0}
#         service_logic.post_witsml(data, quality_control.pk)
#
#         data.update({'quality_control_id': quality_control.pk})
#         self.assertEqual(data, WitsmlSerializer(Witsml.objects.get(quality_control=quality_control.pk)).data)
