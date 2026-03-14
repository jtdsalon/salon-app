import { useState, useEffect, useCallback } from 'react';
import { getServicesApi } from '@/services/api/serviceService';
import { getPromotionByIdApi, toApiPromotionType, toUiPromotionType } from '@/services/api/promotionService';
import { usePromotion } from '@/state/promotion';

export const PROMOTION_STEPS = [
  'Basic Info',
  'Discount Config',
  'Service Selection',
  'Duration & Timing',
  'Limits & Featured',
] as const;

export const PROMOTION_TYPES = [
  'Service Discount',
  'Bundle Package',
  'First-Time Offer',
  'Happy Hour',
  'Campaign',
  'Featured Promotion',
] as const;

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export const INITIAL_FORM_DATA = {
  title: '',
  description: '',
  code: '',
  type: 'Service Discount' as const,
  discountType: 'percentage' as const,
  discountValue: '',
  selectedServiceIds: [] as string[],
  selectedCategories: [] as string[],
  minBookingValue: '',
  eligibleDays: [] as number[],
  startDate: '',
  endDate: '',
  isHappyHour: false,
  happyHourStart: '10:00',
  happyHourEnd: '14:00',
  happyHourDays: [1, 2, 3, 4] as number[],
  usageLimit: '',
  perUserLimit: '1',
  isFeatured: false,
  bundlePrice: '',
  priority: '0',
};

export type PromotionType = (typeof PROMOTION_TYPES)[number];
export type DiscountType = 'percentage' | 'fixed';
export type PromotionFormData = Omit<typeof INITIAL_FORM_DATA, 'type' | 'discountType'> & {
  type: PromotionType;
  discountType?: DiscountType;
};

export interface UseCreatePromotionFormProps {
  salonId: string;
  editPromotionId?: string;
  duplicateFromId?: string;
  onCancel?: () => void;
  onSave: () => void;
}

export function useCreatePromotionForm({ salonId, editPromotionId, duplicateFromId, onSave }: UseCreatePromotionFormProps) {
  const {
    handleCreatePromotion,
    handleUpdatePromotion,
    creating,
    updating,
    success,
    error: promotionError,
    handleClearSuccess,
    handleClearError,
  } = usePromotion();

  const isEdit = !!editPromotionId;
  const loadFromId = editPromotionId || duplicateFromId;

  const [activeStep, setActiveStep] = useState(0);
  const [services, setServices] = useState<Array<{ id: string; name: string; category?: string }>>([]);
  const [loadingEdit, setLoadingEdit] = useState(!!loadFromId);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<PromotionFormData>(INITIAL_FORM_DATA);

  useEffect(() => {
    if (!salonId) return;
    getServicesApi(salonId)
      .then((res) => {
        const arr = res?.data?.data ?? res?.data ?? [];
        setServices(
          Array.isArray(arr) ? arr.map((s: { id: string; name?: string; serviceName?: string; category?: string }) => ({
            id: s.id,
            name: s.name || s.serviceName || '',
            category: s.category || 'General',
          })) : []
        );
      })
      .catch(() => setServices([]));
  }, [salonId]);

  useEffect(() => {
    if (!loadFromId) return;
    setLoadingEdit(true);
    getPromotionByIdApi(loadFromId)
      .then((res) => {
        const p = res?.data?.data ?? res?.data;
        if (!p) return;
        const sched = (p.happy_hour_schedule || {}) as { days?: number[]; startTime?: string; endTime?: string };
        const discountType = (p.discount_type as 'percentage' | 'fixed') || 'percentage';
        const discountVal = discountType === 'percentage'
          ? (p.discount_percent ?? p.discount_value)
          : p.discount_value;
        const eligibleDaysRaw = (p as any).eligible_days;
        const eligibleDays: number[] = Array.isArray(eligibleDaysRaw)
          ? eligibleDaysRaw.map((d: number | string) => {
              if (typeof d === 'number' && d >= 0 && d <= 6) return d;
              const idx = DAY_LABELS.indexOf(String(d) as any);
              return idx >= 0 ? idx : 0;
            }).filter((d, i, arr) => arr.indexOf(d) === i)
          : [];
        setFormData({
          title: p.title || '',
          description: p.description || '',
          code: p.code || '',
          type: (toUiPromotionType(p.promotion_type) as any) || 'Service Discount',
          discountType,
          discountValue: discountVal != null ? String(discountVal) : '',
          selectedServiceIds: (p.promotion_services || []).map((ps: any) => ps.service_id || ps.service?.id).filter(Boolean),
          selectedCategories: ((p as any).promotion_categories || []).map((pc: any) => pc.category || '').filter(Boolean),
          minBookingValue: (p as any).min_booking_value != null ? String((p as any).min_booking_value) : '',
          eligibleDays,
          startDate: p.start_date ? String(p.start_date).slice(0, 10) : '',
          endDate: p.end_date ? String(p.end_date).slice(0, 10) : '',
          isHappyHour: !!(sched.startTime || sched.endTime),
          happyHourStart: sched.startTime || '10:00',
          happyHourEnd: sched.endTime || '14:00',
          happyHourDays: Array.isArray(sched.days) ? sched.days : [1, 2, 3, 4],
          usageLimit: p.usage_limit != null ? String(p.usage_limit) : '',
          perUserLimit: p.per_user_limit != null ? String(p.per_user_limit) : '1',
          isFeatured: p.is_featured ?? false,
          bundlePrice: p.bundle_price != null ? String(p.bundle_price) : '',
          priority: p.priority != null ? String(p.priority) : '0',
        });
      })
      .catch(() => setSubmitError('Failed to load promotion'))
      .finally(() => setLoadingEdit(false));
  }, [loadFromId]);

  useEffect(() => {
    handleClearSuccess();
    handleClearError();
  }, [editPromotionId, duplicateFromId]);

  useEffect(() => {
    handleClearSuccess();
    handleClearError();
  }, [handleClearSuccess, handleClearError]);

  useEffect(() => {
    if (success && !creating && !updating) {
      handleClearSuccess();
      onSave();
    }
  }, [success, creating, updating, onSave, handleClearSuccess]);

  const handleBack = useCallback(() => setActiveStep((prev) => prev - 1), []);

  const handleFieldChange = useCallback((field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  /** Step-specific validation - returns errors for the given step */
  const validateStep = useCallback(
    (step: number): Record<string, string> => {
      const errs: Record<string, string> = {};

      // Step 0: Basic Information
      if (step === 0) {
        if (!formData.title?.trim()) errs.title = 'Title is required';
        else if (formData.title.trim().length > 150) errs.title = 'Title must be 150 characters or less';
        if (formData.description && formData.description.length > 2000) errs.description = 'Description must be 2000 characters or less';
        if (formData.code && formData.code.trim().length > 50) errs.code = 'Promo code must be 50 characters or less';
      }

      // Step 1: Discount Configuration
      if (step === 1) {
        if (formData.type !== 'Bundle Package') {
          const val = formData.discountValue ? parseFloat(String(formData.discountValue)) : NaN;
          if (!formData.discountValue || formData.discountValue === '') errs.discountValue = 'Discount value is required';
          else if (isNaN(val) || val <= 0) errs.discountValue = 'Discount value must be greater than 0';
          else if (formData.discountType === 'percentage' && (val < 0 || val > 100)) errs.discountValue = 'Percentage must be between 0 and 100';
        } else {
          if (!formData.bundlePrice || formData.bundlePrice === '') errs.bundlePrice = 'Bundle price is required for Bundle Package';
          else {
            const val = parseFloat(String(formData.bundlePrice));
            if (isNaN(val) || val <= 0) errs.bundlePrice = 'Bundle price must be greater than 0';
          }
        }
      }

      // Step 2: Service Selection
      if (step === 2) {
        const needsTargeting = ['Service Discount', 'Bundle Package'].includes(formData.type);
        const hasServices = (formData.selectedServiceIds?.length ?? 0) > 0;
        const hasCategories = (formData.selectedCategories?.length ?? 0) > 0;
        if (needsTargeting && !hasServices && !hasCategories) {
          errs.selectedServiceIds = 'Select at least one service or category for this promotion type';
        }
      }

      // Step 3: Duration & Timing
      if (step === 3) {
        if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
          errs.endDate = 'End date must be on or after start date';
        }
        if (formData.isHappyHour && formData.happyHourStart && formData.happyHourEnd) {
          const [sh, sm] = formData.happyHourStart.split(':').map(Number);
          const [eh, em] = formData.happyHourEnd.split(':').map(Number);
          if (sh * 60 + sm >= eh * 60 + em) errs.happyHourEnd = 'End time must be after start time';
        }
      }

      // Step 4: Limits & Visibility
      if (step === 4) {
        if (formData.usageLimit && formData.usageLimit !== '') {
          const val = parseInt(String(formData.usageLimit), 10);
          if (isNaN(val) || val < 1) errs.usageLimit = 'Usage limit must be at least 1';
        }
        const perUserVal = formData.perUserLimit ? parseInt(String(formData.perUserLimit), 10) : 1;
        if (isNaN(perUserVal) || perUserVal < 1) errs.perUserLimit = 'Per-user limit must be at least 1';
        const priorityVal = formData.priority ? parseInt(String(formData.priority), 10) : 0;
        if (formData.priority !== '' && formData.priority !== undefined && (isNaN(priorityVal) || priorityVal < 0)) {
          errs.priority = 'Priority must be 0 or greater';
        }
      }

      return errs;
    },
    [formData]
  );

  const handleNext = useCallback(() => {
    const errs = validateStep(activeStep);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setActiveStep((prev) => prev + 1);
  }, [activeStep, validateStep]);

  /** Full validation for final submit */
  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    for (let s = 0; s < 5; s++) {
      Object.assign(errs, validateStep(s));
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }, [validateStep]);

  const handleSubmit = useCallback(() => {
    handleClearError();
    setSubmitError(null);
    if (!validate()) return;

    const payload: Record<string, unknown> = {
      title: formData.title.trim(),
      description: formData.description?.trim() || undefined,
      code: formData.code?.trim() || undefined,
      promotion_type: toApiPromotionType(formData.type),
      discount_type: formData.discountType,
      start_date: formData.startDate || undefined,
      end_date: formData.endDate || undefined,
      usage_limit: formData.usageLimit ? parseInt(String(formData.usageLimit), 10) : undefined,
      per_user_limit: formData.perUserLimit ? parseInt(String(formData.perUserLimit), 10) : 1,
      is_featured: formData.isFeatured,
      priority: formData.priority ? parseInt(String(formData.priority), 10) : 0,
      serviceIds: formData.selectedServiceIds,
      categories: formData.selectedCategories?.length ? formData.selectedCategories : undefined,
      min_booking_value: formData.minBookingValue ? parseFloat(String(formData.minBookingValue)) : undefined,
      eligible_days: formData.eligibleDays?.length ? formData.eligibleDays.map((d) => DAY_LABELS[d]) : undefined,
    };
    if (formData.type === 'Bundle Package' && formData.bundlePrice) {
      payload.bundle_price = parseFloat(String(formData.bundlePrice));
    } else if (formData.discountValue) {
      const val = parseFloat(String(formData.discountValue));
      payload.discount_value = val;
      if (formData.discountType === 'percentage') {
        payload.discount_percent = Math.round(val);
      }
    }
    if (formData.isHappyHour) {
      payload.happy_hour_schedule = {
        days: formData.happyHourDays,
        startTime: formData.happyHourStart,
        endTime: formData.happyHourEnd,
      };
    }
    if (isEdit && editPromotionId) {
      handleUpdatePromotion(editPromotionId, payload);
    } else {
      (payload as Record<string, unknown>).salon_id = salonId;
      handleCreatePromotion(payload);
    }
  }, [
    formData,
    isEdit,
    editPromotionId,
    salonId,
    validate,
    handleClearError,
    handleUpdatePromotion,
    handleCreatePromotion,
  ]);

  const clearSubmitError = useCallback(() => setSubmitError(null), []);

  const displayError =
    submitError ||
    (typeof promotionError === 'string' ? promotionError : (promotionError as { errorMessage?: string; message?: string })?.errorMessage || (promotionError as { errorMessage?: string; message?: string })?.message);

  return {
    // State
    formData,
    services,
    activeStep,
    loadingEdit,
    fieldErrors,
    creating,
    updating,
    isEdit,
    editPromotionId,

    // Actions
    handleNext,
    handleBack,
    handleFieldChange,
    handleSubmit,
    clearSubmitError,
    handleClearError,

    // Derived
    displayError,
    isSubmitting: creating || updating,
  };
}
