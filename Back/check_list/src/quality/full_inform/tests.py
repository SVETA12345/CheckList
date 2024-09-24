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
# from .models import Full_inform
# from .serializers import Full_informSerializer
# from . import views as full_inform_views
# from .service_logics import Full_informFullGet
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
#
#         self.full_inform_1_attributes = {'titul_list': '', 'well_construction': '', 'wellbore_sizes': '',
#                                          'chrono_data': '', 'sol_data': '', 'dash_comp': '', 'summary_data': '',
#                                          'inklino_data': '', 'main_record': '', 'parametr': '', 'control_record': '',
#                                          'lqc': '', 'calibration': '', 'full_inf_count': 0,
#                                          'quality_control': self.quality_control_1}
#         self.full_inform_1 = Full_inform.objects.create(**self.full_inform_1_attributes)
#
#         Full_inform.objects.create(titul_list='', well_construction='', wellbore_sizes='',
#                                    chrono_data='', sol_data='', dash_comp='', summary_data='',
#                                    inklino_data='', main_record='', parametr='', control_record='',
#                                    lqc='', calibration='', full_inf_count=0, quality_control=self.quality_control_2)
#
#         self.serializer_full_inform = Full_informSerializer(instance=self.full_inform_1_attributes)
#
#     def test_model_field_duplicate(self):
#         full_inform = Full_inform(titul_list='', well_construction='', wellbore_sizes='',
#                                   chrono_data='', sol_data='', dash_comp='', summary_data='',
#                                   inklino_data='', main_record='', parametr='', control_record='',
#                                   lqc='', calibration='', full_inf_count=0, quality_control=self.quality_control_2)
#         with self.assertRaises(ValidationError):
#             full_inform.full_clean()
#
#     def test_serializer_contains_expected_fields(self):
#         data = self.serializer_full_inform.data
#         set_for_serializer = set(['titul_list', 'well_construction',
#                                   'wellbore_sizes', 'chrono_data', 'sol_data', 'dash_comp',
#                                   'summary_data', 'inklino_data', 'main_record', 'parametr',
#                                   'control_record', 'lqc', 'calibration', 'full_inf_count'])
#         self.assertEqual(set(data.keys()), set_for_serializer)
#         for field_for_serializer in set_for_serializer:
#             self.field_for_serializer_full_inform(field_for_serializer, data)
#
#     def field_for_serializer_full_inform(self, field_for_serializer, data):
#         self.assertEqual(data[field_for_serializer], self.full_inform_1_attributes[field_for_serializer])
#
#     def check_model_field_max_length(self, field_max_length):
#         self.assertEquals(field_max_length, 120)
#
#     def test_model_field_max_length(self):
#         set_for_model = set(['titul_list', 'well_construction',
#                              'wellbore_sizes', 'chrono_data', 'sol_data', 'dash_comp',
#                              'summary_data', 'inklino_data', 'main_record', 'parametr',
#                              'control_record', 'lqc', 'calibration'])
#         full_inform = Full_inform.objects.get(quality_control=self.full_inform_1.pk)
#         for field in set_for_model:
#             self.check_model_field_max_length(full_inform._meta.get_field(field).max_length)
#
#     def test_create_with_wrong_field(self):
#         quality_control = Quality_control.objects.create(value=1, density=1, section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                          wellbore=self.wellbore_3)
#         full_inform = Full_inform(titul_list='something', well_construction='', wellbore_sizes='',
#                                   chrono_data='', sol_data='', dash_comp='', summary_data='',
#                                   inklino_data='', main_record='', parametr='', control_record='',
#                                   lqc='', calibration='', full_inf_count=0, quality_control=quality_control)
#         with self.assertRaises(ValidationError):
#             full_inform.full_clean()
#         quality_control.delete()
#
#     def test_model_full_inform_quality_control(self):
#         full_inform = Full_inform.objects.get(quality_control=self.full_inform_1.pk)
#         self.assertEqual(self.quality_control_1, full_inform.quality_control)
#         self.assertEqual(self.quality_control_1.pk, full_inform.pk)
#
#         quality_control = Quality_control.objects.create(value=1, density=1, section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                          wellbore=self.wellbore_3)
#         Full_inform.objects.create(titul_list='something', well_construction='', wellbore_sizes='',
#                                    chrono_data='', sol_data='', dash_comp='', summary_data='',
#                                    inklino_data='', main_record='', parametr='', control_record='',
#                                    lqc='', calibration='', full_inf_count=0, quality_control=quality_control)
#         quality_control_id = quality_control.pk
#         quality_control.delete()
#         with self.assertRaises(Full_inform.DoesNotExist):
#             Full_inform.objects.get(quality_control=quality_control_id)
#
#     def test_full_inform_create_view(self):
#         quality_control = Quality_control.objects.create(value=1, density=1, section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                          wellbore=self.wellbore_3)
#         data = self.full_inform_1_attributes
#         del data['quality_control']
#         responce_post = self.client.post(reverse('quality.full_inform:full_inform_create_view',
#                                                  kwargs={'pk_quality_control': quality_control.pk}), data)
#         full_inform = Full_inform.objects.get(quality_control=quality_control.pk)
#         self.assertEqual(201, responce_post.status_code)
#         self.assertEqual(Full_informSerializer(full_inform).data, json.loads(json.dumps(responce_post.data)))
#         self.assertEqual(responce_post.resolver_match.func.__name__,
#                          full_inform_views.Full_informCreateView.as_view().__name__)
#
#     def test_full_inform_list_view(self):
#         responce_get = self.client.get('/api/full_inform/')
#         full_inform = Full_inform.objects.all().values()
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(list(full_inform), list(responce_get.data))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          full_inform_views.Full_informView.as_view().__name__)
#
#     def test_single_full_inform_view(self):
#         responce_get = self.client.get(reverse('quality.full_inform:single_full_inform_view',
#                                                kwargs={'pk': self.quality_control_1.pk}))
#         full_inform = Full_inform.objects.get(quality_control=self.quality_control_1.pk)
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(Full_informSerializer(full_inform).data, dict(responce_get.data))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          full_inform_views.SingleFull_informView.as_view().__name__)
#
#         quality_control = Quality_control.objects.create(value=1, density=1, section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                          wellbore=self.wellbore_3)
#         full_inform = Full_inform.objects.create(titul_list='', well_construction='', wellbore_sizes='',
#                                                  chrono_data='', sol_data='', dash_comp='', summary_data='',
#                                                  inklino_data='', main_record='', parametr='', control_record='',
#                                                  lqc='', calibration='', full_inf_count=0,
#                                                  quality_control=quality_control)
#         data = self.full_inform_1_attributes
#         data['quality_control'] = quality_control
#         data['titul_list'] = 'Полная'
#
#         responce_put = self.client.put(reverse('quality.full_inform:single_full_inform_view',
#                                                kwargs={'pk': full_inform.pk}), data)
#         self.assertEqual(200, responce_put.status_code)
#         self.assertNotEqual(Full_informSerializer(full_inform).data, dict(responce_put.data))
#         self.assertEqual(responce_put.resolver_match.func.__name__,
#                          full_inform_views.SingleFull_informView.as_view().__name__)
#
#         responce_delete = self.client.delete(reverse('quality.full_inform:single_full_inform_view',
#                                              kwargs={'pk': full_inform.pk}), data)
#         self.assertEqual(204, responce_delete.status_code)
#         self.assertEqual(responce_delete.resolver_match.func.__name__,
#                          full_inform_views.SingleFull_informView.as_view().__name__)
#         with self.assertRaises(Full_inform.DoesNotExist):
#             Full_inform.objects.get(quality_control=full_inform.pk)
#         quality_control.delete()
#
#     def service_get(self, service_logic):
#         service_logic.full_inform(self.full_inform_1.pk)
#         full_inform_dict = Full_informSerializer(self.full_inform_1).data
#         del full_inform_dict['quality_control_id']
#         data = {'full_inform': full_inform_dict}
#         self.assertEqual(data, service_logic.data)
#
#         service_logic.full_inform(None)
#         self.assertEqual("Full inform Does Not Exist", service_logic.exception)
#
#     def test_service(self):
#         service_logic = Full_informFullGet()
#         self.assertEqual(None, service_logic.exception)
#         self.assertFalse(any(service_logic.data))
#
#         self.service_get(service_logic)
#
#         quality_control = Quality_control.objects.create(value=1, density=1, section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                          wellbore=self.wellbore_3)
#         data = self.full_inform_1_attributes
#         del data['quality_control']
#         service_logic.post_full_inform(data, quality_control.pk)
#
#         data.update({'quality_control_id': quality_control.pk})
#         self.assertEqual(data, Full_informSerializer(Full_inform.objects.get(quality_control=quality_control.pk)).data)
