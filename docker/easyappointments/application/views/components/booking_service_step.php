<div id="wizard-frame-2" class="wizard-frame p-3 p-md-4" style="display:none;">
    <div class="frame-container py-3">
        <h2 class="frame-title fw-light text-center mb-4 text-muted"><?= lang('service') ?></h2>

        <div id="service-choices" class="booking-choice-grid booking-service-grid" role="group"
             aria-label="<?= e(lang('service')) ?>"></div>
        <p id="service-selection-prompt" class="text-danger mt-3 mb-0" hidden>
            <?= lang('please_select') ?>
        </p>

        <div id="service-description" class="small mt-3"></div>
    </div>

    <div class="command-buttons text-center my-3 mx-auto d-md-flex justify-content-md-between">
        <button type="button" id="button-back-2" class="btn button-back btn-outline-secondary"
                data-step_index="2">
            <i class="fas fa-chevron-left me-2"></i>
            <?= lang('back') ?>
        </button>
    </div>
</div>
